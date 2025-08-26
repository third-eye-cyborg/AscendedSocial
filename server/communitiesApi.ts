import type { Express } from "express";
import { eq, and, desc, sql, asc, like, or } from "drizzle-orm";
import { db } from "./db";
import { 
  communities, 
  communityMemberships, 
  communityPosts,
  users,
  posts, 
  insertCommunitySchema
} from "@shared/schema";
import { isAuthenticated } from "./replitAuth";
import { hybridStorage } from "./hybridStorage";
import { cloudflareImages } from "./cloudflareImages";

export function registerCommunitiesRoutes(app: Express): void {
  // Get communities with search and filtering
  app.get("/api/communities", async (req, res) => {
    try {
      const { 
        search = "", 
        category, 
        privacy = "all",
        sort = "members", // members, activity, newest
        limit = "20", 
        offset = "0" 
      } = req.query;
      
      const userId = (req.user as any)?.claims?.sub;

      let query = db
        .select({
          community: communities,
          memberCount: sql<number>`(SELECT COUNT(*) FROM ${communityMemberships} WHERE ${communityMemberships.communityId} = ${communities.id})`,
          postCount: sql<number>`(SELECT COUNT(*) FROM ${communityPosts} WHERE ${communityPosts.communityId} = ${communities.id})`,
          isUserMember: userId ? sql<boolean>`(SELECT EXISTS(SELECT 1 FROM ${communityMemberships} WHERE ${communityMemberships.communityId} = ${communities.id} AND ${communityMemberships.userId} = ${userId}))` : sql<boolean>`false`,
          recentActivity: sql<string>`(SELECT MAX(${communityPosts.createdAt}) FROM ${communityPosts} WHERE ${communityPosts.communityId} = ${communities.id})`
        })
        .from(communities)
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      // Apply filters
      let conditions = [];

      if (search) {
        conditions.push(
          or(
            like(communities.name, `%${search}%`),
            like(communities.description, `%${search}%`),
            like(communities.description, `%${search}%`)
          )
        );
      }

      if (category && category !== "all") {
        conditions.push(eq(communities.primaryChakra, category as any));
      }

      if (privacy !== "all") {
        if (privacy === "public") {
          conditions.push(eq(communities.isPrivate, false));
        } else if (privacy === "private") {
          conditions.push(eq(communities.isPrivate, true));
        }
      }

      // Always filter out private communities for non-members unless they're the owner
      if (!userId) {
        conditions.push(eq(communities.isPrivate, false));
      } else {
        conditions.push(
          or(
            eq(communities.isPrivate, false),
            eq(communities.creatorId, userId),
            sql`EXISTS(SELECT 1 FROM ${communityMemberships} WHERE ${communityMemberships.communityId} = ${communities.id} AND ${communityMemberships.userId} = ${userId})`
          )
        );
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      const result = await query;
      
      // Sort in memory since Drizzle typing is complex
      let sortedResult = [...result];
      switch (sort) {
        case "newest":
          sortedResult.sort((a, b) => new Date(b.community.createdAt || 0).getTime() - new Date(a.community.createdAt || 0).getTime());
          break;
        case "activity":
          sortedResult.sort((a, b) => new Date(b.recentActivity || 0).getTime() - new Date(a.recentActivity || 0).getTime());
          break;
        case "members":
        default:
          sortedResult.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
          break;
      }

      res.json(sortedResult);
    } catch (error) {
      console.error("Error fetching communities:", error);
      res.status(500).json({ error: "Failed to fetch communities" });
    }
  });

  // Get single community with detailed info
  app.get("/api/communities/:communityId", async (req, res) => {
    try {
      const { communityId } = req.params;
      const userId = (req.user as any)?.claims?.sub;

      const [communityData] = await db
        .select({
          community: communities,
          owner: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName,
          },
          memberCount: sql<number>`(SELECT COUNT(*) FROM ${communityMemberships} WHERE ${communityMemberships.communityId} = ${communities.id})`,
          postCount: sql<number>`(SELECT COUNT(*) FROM ${communityPosts} WHERE ${communityPosts.communityId} = ${communities.id})`,
          isUserMember: userId ? sql<boolean>`(SELECT EXISTS(SELECT 1 FROM ${communityMemberships} WHERE ${communityMemberships.communityId} = ${communities.id} AND ${communityMemberships.userId} = ${userId}))` : sql<boolean>`false`,
          userRole: userId ? sql<string>`(SELECT ${communityMemberships.role} FROM ${communityMemberships} WHERE ${communityMemberships.communityId} = ${communities.id} AND ${communityMemberships.userId} = ${userId})` : sql<string>`null`,
        })
        .from(communities)
        .leftJoin(users, eq(communities.creatorId, users.id))
        .where(eq(communities.id, communityId));

      if (!communityData) {
        return res.status(404).json({ error: "Community not found" });
      }

      const community = communityData.community;

      // Check privacy permissions
      if (community.isPrivate && 
          community.creatorId !== userId && 
          !communityData.isUserMember) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(communityData);
    } catch (error) {
      console.error("Error fetching community:", error);
      res.status(500).json({ error: "Failed to fetch community" });
    }
  });

  // Create a new community
  app.post("/api/communities", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const communityData = insertCommunitySchema.parse(req.body);

      // Process community banner/icon if provided
      let processedImageUrl = communityData.imageUrl;
      if (communityData.imageUrl && communityData.imageUrl.startsWith("data:")) {
        // Image processing would go here
        console.log("Image processing not implemented yet");
      }

      const [newCommunity] = await db
        .insert(communities)
        .values({
          ...communityData,
          creatorId: userId,
          imageUrl: processedImageUrl,
        })
        .returning();

      // Automatically add creator as admin member
      await db
        .insert(communityMemberships)
        .values({
          communityId: newCommunity.id,
          userId,
          status: "admin",
        });

      res.status(201).json(newCommunity);
    } catch (error) {
      console.error("Error creating community:", error);
      res.status(500).json({ error: "Failed to create community" });
    }
  });

  // Join/Leave community
  app.post("/api/communities/:communityId/join", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { communityId } = req.params;

      // Check if community exists and is accessible
      const [community] = await db
        .select()
        .from(communities)
        .where(eq(communities.id, communityId));

      if (!community) {
        return res.status(404).json({ error: "Community not found" });
      }

      // Check if user is already a member
      const [existingMember] = await db
        .select()
        .from(communityMemberships)
        .where(and(
          eq(communityMemberships.communityId, communityId),
          eq(communityMemberships.userId, userId)
        ));

      if (existingMember) {
        // Leave community
        await db
          .delete(communityMemberships)
          .where(and(
            eq(communityMemberships.communityId, communityId),
            eq(communityMemberships.userId, userId)
          ));

        res.json({ action: "left", message: "Left community successfully" });
      } else {
        // Join community
        const [newMember] = await db
          .insert(communityMemberships)
          .values({
            communityId,
            userId,
            status: "active"
          })
          .returning();

        res.json({ action: "joined", message: "Joined community successfully", member: newMember });
      }
    } catch (error) {
      console.error("Error joining/leaving community:", error);
      res.status(500).json({ error: "Failed to join/leave community" });
    }
  });

  // Get community members
  app.get("/api/communities/:communityId/members", async (req, res) => {
    try {
      const { communityId } = req.params;
      const { limit = "50", offset = "0" } = req.query;
      const userId = (req.user as any)?.claims?.sub;

      // Check if user has access to view members
      const [community] = await db
        .select()
        .from(communities)
        .where(eq(communities.id, communityId));

      if (!community) {
        return res.status(404).json({ error: "Community not found" });
      }

      if (community.isPrivate) {
        const [membership] = await db
          .select()
          .from(communityMemberships)
          .where(and(
            eq(communityMemberships.communityId, communityId),
            eq(communityMemberships.userId, userId || "")
          ));

        if (!membership && community.creatorId !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      const members = await db
        .select({
          member: communityMemberships,
          user: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName,
            aura: users.aura,
            energy: users.energy,
          }
        })
        .from(communityMemberships)
        .leftJoin(users, eq(communityMemberships.userId, users.id))
        .where(eq(communityMemberships.communityId, communityId))
        .orderBy(asc(communityMemberships.joinedAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      res.json(members);
    } catch (error) {
      console.error("Error fetching community members:", error);
      res.status(500).json({ error: "Failed to fetch community members" });
    }
  });

  // Get community posts
  app.get("/api/communities/:communityId/posts", async (req, res) => {
    try {
      const { communityId } = req.params;
      const { limit = "20", offset = "0" } = req.query;
      const userId = (req.user as any)?.claims?.sub;

      // Check access permissions first
      const [community] = await db
        .select()
        .from(communities)
        .where(eq(communities.id, communityId));

      if (!community) {
        return res.status(404).json({ error: "Community not found" });
      }

      if (community.isPrivate) {
        const [membership] = await db
          .select()
          .from(communityMemberships)
          .where(and(
            eq(communityMemberships.communityId, communityId),
            eq(communityMemberships.userId, userId || "")
          ));

        if (!membership && community.creatorId !== userId) {
          return res.status(403).json({ error: "Access denied" });
        }
      }

      const communityPostsData = await db
        .select({
          post: communityPosts,
          author: {
            id: users.id,
            username: users.username,
            profileImageUrl: users.profileImageUrl,
            firstName: users.firstName,
            lastName: users.lastName,
          }
        })
        .from(communityPosts)
        .leftJoin(users, eq(communityPosts.authorId, users.id))
        .where(eq(communityPosts.communityId, communityId))
        .orderBy(desc(communityPosts.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      res.json(communityPostsData);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ error: "Failed to fetch community posts" });
    }
  });

  // Share post to community
  app.post("/api/communities/:communityId/posts", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { communityId } = req.params;
      const { postId } = req.body;

      // Verify user is a member
      const [membership] = await db
        .select()
        .from(communityMemberships)
        .where(and(
          eq(communityMemberships.communityId, communityId),
          eq(communityMemberships.userId, userId)
        ));

      if (!membership) {
        return res.status(403).json({ error: "Must be a community member to share posts" });
      }

      // Check if post already shared to this community
      const [existingShare] = await db
        .select()
        .from(communityPosts)
        .where(and(
          eq(communityPosts.communityId, communityId),
          eq(communityPosts.postId, postId)
        ));

      if (existingShare) {
        return res.status(400).json({ error: "Post already shared to this community" });
      }

      const [sharedPost] = await db
        .insert(communityPosts)
        .values({
          communityId,
          authorId: userId,
          content: `Shared post: ${postId}`,
        })
        .returning();

      res.status(201).json(sharedPost);
    } catch (error) {
      console.error("Error sharing post to community:", error);
      res.status(500).json({ error: "Failed to share post to community" });
    }
  });

  // Get upload URL for community assets
  app.post("/api/communities/upload-url", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { category = "community-image" } = req.body;

      const uploadInfo = await hybridStorage.getUploadUrl(
        userId,
        "community-assets",
        "image/jpeg",
        category
      );

      res.json(uploadInfo);
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Update community (admin only)
  app.put("/api/communities/:communityId", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const { communityId } = req.params;
      const updateData = insertCommunitySchema.partial().parse(req.body);

      // Check if user is admin or owner
      const [community] = await db
        .select()
        .from(communities)
        .where(eq(communities.id, communityId));

      if (!community) {
        return res.status(404).json({ error: "Community not found" });
      }

      const [membership] = await db
        .select()
        .from(communityMemberships)
        .where(and(
          eq(communityMemberships.communityId, communityId),
          eq(communityMemberships.userId, userId)
        ));

      if (community.creatorId !== userId && 
          (!membership || membership.status !== "admin")) {
        return res.status(403).json({ error: "Admin access required" });
      }

      const [updatedCommunity] = await db
        .update(communities)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(communities.id, communityId))
        .returning();

      res.json(updatedCommunity);
    } catch (error) {
      console.error("Error updating community:", error);
      res.status(500).json({ error: "Failed to update community" });
    }
  });
}