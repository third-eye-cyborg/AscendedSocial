import type { Express } from "express";
import { eq, and, desc, sql, asc } from "drizzle-orm";
import { db } from "./db";
import { 
  visions, 
  visionEngagements, 
  users, 
  insertVisionSchema, 
  insertVisionEngagementSchema 
} from "@shared/schema";
import { isAuthenticated } from "./replitAuth";
// import { openai } from "./openai";
import { hybridStorage } from "./hybridStorage";
import { cloudflareWorkers } from "./cloudflareWorkers";

export function registerVisionsRoutes(app: Express): void {
  // Get visions with filtering and pagination
  app.get("/api/visions", async (req, res) => {
    try {
      const { tab = "all", chakra, privacy, limit = "20", offset = "0" } = req.query;
      const userId = (req.user as any)?.claims?.sub;

      let query = db
        .select({
          vision: visions,
          author: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName,
          }
        })
        .from(visions)
        .leftJoin(users, eq(visions.authorId, users.id))
        .orderBy(desc(visions.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      // Apply filters
      let conditions = [];

      if (tab === "my-visions" && userId) {
        conditions.push(eq(visions.authorId, userId));
      } else if (tab === "friends" && userId) {
        // TODO: Add friends filter when connections are available
        conditions.push(eq(visions.privacy, "public"));
      } else if (tab === "manifested") {
        conditions.push(eq(visions.isManifested, true));
      }

      if (chakra && chakra !== "all") {
        conditions.push(eq(visions.chakra, chakra as any));
      }

      if (privacy && privacy !== "all") {
        conditions.push(eq(visions.privacy, privacy as any));
      }

      // Apply privacy filters based on user
      if (!userId) {
        // Non-authenticated users can only see public visions
        conditions.push(eq(visions.privacy, "public"));
      } else {
        // Authenticated users can see public visions and their own private/friends visions
        conditions.push(
          sql`${visions.privacy} = 'public' OR (${visions.privacy} IN ('private', 'friends') AND ${visions.authorId} = ${userId})`
        );
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      const result = await query;
      
      const visionsWithAuthor = result.map(row => ({
        ...row.vision,
        author: row.author
      }));

      res.json(visionsWithAuthor);
    } catch (error) {
      console.error("Error fetching visions:", error);
      res.status(500).json({ error: "Failed to fetch visions" });
    }
  });

  // Get vision statistics for current user
  app.get("/api/visions/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;

      // Get user's vision counts
      const [totalVisions] = await db
        .select({ count: sql<number>`count(*)` })
        .from(visions)
        .where(eq(visions.authorId, userId));

      const [manifestedVisions] = await db
        .select({ count: sql<number>`count(*)` })
        .from(visions)
        .where(and(
          eq(visions.authorId, userId),
          eq(visions.isManifested, true)
        ));

      // Get average energy level
      const [avgEnergy] = await db
        .select({ avg: sql<number>`AVG(${visions.energyLevel})` })
        .from(visions)
        .where(eq(visions.authorId, userId));

      // Get dominant chakra
      const dominantChakraResult = await db
        .select({ 
          chakra: visions.chakra, 
          count: sql<number>`count(*)` 
        })
        .from(visions)
        .where(eq(visions.authorId, userId))
        .groupBy(visions.chakra)
        .orderBy(sql`count(*) desc`)
        .limit(1);

      const stats = {
        totalVisions: totalVisions.count || 0,
        manifestedVisions: manifestedVisions.count || 0,
        averageEnergyLevel: Math.round(avgEnergy.avg || 0),
        dominantChakra: dominantChakraResult[0]?.chakra || "heart"
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching vision stats:", error);
      res.status(500).json({ error: "Failed to fetch vision stats" });
    }
  });

  // Create a new vision
  app.post("/api/visions", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const visionData = insertVisionSchema.parse(req.body);

      // AI-powered chakra analysis and spiritual insights
      let chakraType: string = "heart"; // default
      let spiritualInsights: any = {};
      let energyLevel = 1;

      try {
        // Use OpenAI to analyze the vision content
        const analysisPrompt = `Analyze this spiritual vision and provide:
1. The most relevant chakra (root, sacral, solar, heart, throat, third_eye, crown)
2. Spiritual insights and symbolism
3. Energy level (1-100 scale)

Vision Title: ${visionData.title}
Vision Content: ${visionData.content}
Symbols: ${visionData.symbols?.join(", ") || "none"}

Return a JSON object with: { "chakra": "chakra_name", "insights": {"themes": [], "symbols": [], "guidance": ""}, "energyLevel": number }`;

        // Temporarily disable OpenAI integration
        /*const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a spiritual guide AI that analyzes visions and provides chakra classifications and spiritual insights. Always respond with valid JSON."
            },
            {
              role: "user",
              content: analysisPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        });

        const analysisResult = JSON.parse(completion.choices[0].message.content || "{}");
        chakraType = analysisResult.chakra || "heart";
        spiritualInsights = analysisResult.insights || {};
        energyLevel = analysisResult.energyLevel || 1;*/
      } catch (error) {
        console.error("AI analysis failed, using defaults:", error);
      }

      // Create vision in database
      const [newVision] = await db
        .insert(visions)
        .values({
          ...visionData,
          authorId: userId,
          chakra: chakraType as any,
          spiritualInsights,
          energyLevel,
        })
        .returning();

      // Process with Cloudflare Workers if available
      try {
        const enhancedContent = await cloudflareWorkers.enhanceContent({
          text: visionData.content,
          type: "vision",
          userId,
          context: { symbols: visionData.symbols }
        });
        
        // Update vision with enhanced content if successful
        if (enhancedContent) {
          await db
            .update(visions)
            .set({
              keywords: enhancedContent.spiritualKeywords,
              // Could add more enhanced fields here
            })
            .where(eq(visions.id, newVision.id));
        }
      } catch (error) {
        console.log("Cloudflare Workers enhancement failed, continuing without:", error);
      }

      // Fetch the complete vision with author
      const [completeVision] = await db
        .select({
          vision: visions,
          author: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName,
          }
        })
        .from(visions)
        .leftJoin(users, eq(visions.authorId, users.id))
        .where(eq(visions.id, newVision.id));

      res.status(201).json({
        ...completeVision.vision,
        author: completeVision.author
      });
    } catch (error) {
      console.error("Error creating vision:", error);
      res.status(500).json({ error: "Failed to create vision" });
    }
  });

  // Get upload URL for vision media
  app.post("/api/visions/upload-url", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { category = "vision" } = req.body;

      const uploadInfo = await hybridStorage.getUploadUrl(
        userId,
        "vision-media",
        "application/octet-stream",
        category
      );

      res.json(uploadInfo);
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Engage with a vision (like, energy, etc.)
  app.post("/api/visions/:visionId/engage", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { visionId } = req.params;
      const engagementData = insertVisionEngagementSchema.parse({
        ...req.body,
        visionId
      });

      // Check if user has enough energy for energy-type engagements
      if (engagementData.type === "energy") {
        const [user] = await db
          .select({ energy: users.energy })
          .from(users)
          .where(eq(users.id, userId));

        if (!user || (user.energy || 0) < (engagementData.energyAmount || 1)) {
          return res.status(400).json({ error: "Insufficient energy" });
        }

        // Deduct energy from user
        await db
          .update(users)
          .set({ energy: sql`${users.energy} - ${engagementData.energyAmount || 1}` })
          .where(eq(users.id, userId));
      }

      // Remove any existing engagement of the same type from this user
      await db
        .delete(visionEngagements)
        .where(and(
          eq(visionEngagements.visionId, visionId),
          eq(visionEngagements.userId, userId),
          eq(visionEngagements.type, engagementData.type)
        ));

      // Add new engagement
      const [newEngagement] = await db
        .insert(visionEngagements)
        .values({
          ...engagementData,
          userId
        })
        .returning();

      res.json(newEngagement);
    } catch (error) {
      console.error("Error engaging with vision:", error);
      res.status(500).json({ error: "Failed to engage with vision" });
    }
  });

  // Mark vision as manifested
  app.post("/api/visions/:visionId/manifest", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { visionId } = req.params;

      // Verify vision belongs to user
      const [vision] = await db
        .select()
        .from(visions)
        .where(and(
          eq(visions.id, visionId),
          eq(visions.authorId, userId)
        ));

      if (!vision) {
        return res.status(404).json({ error: "Vision not found or not authorized" });
      }

      // Update vision as manifested
      const [updatedVision] = await db
        .update(visions)
        .set({
          isManifested: true,
          manifestationDate: new Date(),
          updatedAt: new Date()
        })
        .where(eq(visions.id, visionId))
        .returning();

      // Award aura points for manifestation
      await db
        .update(users)
        .set({ aura: sql`${users.aura} + 100` }) // 100 aura points for manifestation
        .where(eq(users.id, userId));

      res.json(updatedVision);
    } catch (error) {
      console.error("Error marking vision as manifested:", error);
      res.status(500).json({ error: "Failed to mark vision as manifested" });
    }
  });

  // Get single vision by ID
  app.get("/api/visions/:visionId", async (req, res) => {
    try {
      const { visionId } = req.params;
      const userId = (req.user as any)?.claims?.sub;

      const [result] = await db
        .select({
          vision: visions,
          author: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName,
          }
        })
        .from(visions)
        .leftJoin(users, eq(visions.authorId, users.id))
        .where(eq(visions.id, visionId));

      if (!result) {
        return res.status(404).json({ error: "Vision not found" });
      }

      // Check privacy permissions
      const vision = result.vision;
      if (vision.privacy === "private" && vision.authorId !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (vision.privacy === "friends" && vision.authorId !== userId && !userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json({
        ...vision,
        author: result.author
      });
    } catch (error) {
      console.error("Error fetching vision:", error);
      res.status(500).json({ error: "Failed to fetch vision" });
    }
  });
}