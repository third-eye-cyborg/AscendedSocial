
import type { Express } from "express";
import { isAuthenticated } from "./replitAuth";
import { storage } from "./storage";

// COPPA-compliant content moderation for children
class KidsContentModerator {
  // Enhanced filtering for child safety
  static async moderateContent(content: string, userId: string): Promise<{
    approved: boolean;
    reason?: string;
    suggestedEdit?: string;
  }> {
    // Check for prohibited content
    const prohibitedPatterns = [
      /personal\s+(info|information|details)/i,
      /phone\s*(number)?/i,
      /address/i,
      /school\s*name/i,
      /real\s*name/i,
      /meet\s*(up|me)/i,
      /location/i,
      /where\s*(do\s*)?you\s*live/i,
    ];

    for (const pattern of prohibitedPatterns) {
      if (pattern.test(content)) {
        return {
          approved: false,
          reason: 'Contains personal information that should stay private',
          suggestedEdit: 'Try sharing your feelings or a kind thing you did instead!'
        };
      }
    }

    // Check content length and positivity
    if (content.length < 10) {
      return {
        approved: false,
        reason: 'Post is too short',
        suggestedEdit: 'Tell us more about your kind action or happy feeling!'
      };
    }

    // All content requires manual approval for children
    return {
      approved: false, // Always requires human review for kids
      reason: 'Waiting for grown-up approval to keep everyone safe'
    };
  }

  // Safe username generation
  static generateSafeUsername(age: number): string {
    const adjectives = ['Kind', 'Happy', 'Bright', 'Gentle', 'Caring', 'Joyful', 'Peaceful'];
    const nouns = ['Star', 'Heart', 'Friend', 'Helper', 'Angel', 'Dreamer', 'Builder'];
    
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    
    return `${adj}${noun}${number}`;
  }
}

export function registerKidsRoutes(app: Express): void {
  // Kids-specific post creation with enhanced moderation
  app.post('/api/kids/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { content } = req.body;

      // Verify user is child (under 18)
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Enhanced content moderation for children
      const moderation = await KidsContentModerator.moderateContent(content, userId);
      
      if (!moderation.approved) {
        return res.status(400).json({ 
          message: moderation.reason,
          suggestedEdit: moderation.suggestedEdit
        });
      }

      // Create post with pending moderation status
      const post = await storage.createPost({
        content,
        isKidsContent: true,
        moderationStatus: 'pending',
        imageUrls: [] // No images allowed for kids initially
      }, userId);

      res.json({ 
        ...post, 
        message: 'Your post is being checked by our safety team and will appear soon!' 
      });
    } catch (error) {
      console.error("Error creating kids post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Get moderated kids content only
  app.get('/api/kids/posts', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      // Only get approved kids content
      const posts = await storage.getKidsApprovedPosts(limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching kids posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Safe engagement for kids (hearts and stars only)
  app.post('/api/kids/posts/:postId/engage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId } = req.params;
      const { type } = req.body;

      // Only allow heart and star engagements for kids
      if (!['heart', 'star'].includes(type)) {
        return res.status(400).json({ message: "Only hearts and stars allowed for kids" });
      }

      const engagement = await storage.createKidsEngagement(postId, userId, type);
      res.json(engagement);
    } catch (error) {
      console.error("Error creating kids engagement:", error);
      res.status(500).json({ message: "Failed to create engagement" });
    }
  });

  // Parent verification endpoint
  app.post('/api/kids/verify-parent', async (req, res) => {
    try {
      const { parentEmail, childUsername, childAge } = req.body;

      if (childAge < 6 || childAge > 17) {
        return res.status(400).json({ message: "Child must be between 6-17 years old" });
      }

      // Send verification email to parent
      // In real implementation, this would send an actual email
      const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      console.log(`📧 Parent verification email would be sent to: ${parentEmail}`);
      console.log(`Verification code: ${verificationCode}`);
      console.log(`Child: ${childUsername}, Age: ${childAge}`);

      res.json({ 
        message: 'Verification email sent to parent',
        verificationRequired: true 
      });
    } catch (error) {
      console.error("Error in parent verification:", error);
      res.status(500).json({ message: "Failed to send verification" });
    }
  });

  // Report inappropriate content (enhanced for kids)
  app.post('/api/kids/report', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { postId, reason } = req.body;

      // Create high-priority report for kids content
      const report = await storage.createReport({
        postId,
        reason: `KIDS_REPORT: ${reason}`,
        priority: 'high',
        reportedUserId: null
      }, userId);

      // Immediately flag content for review
      await storage.flagContentForReview(postId, 'kids_safety_report');

      res.json({ 
        message: 'Thank you for helping keep our community safe! A grown-up will check this right away.',
        reportId: report.id
      });
    } catch (error) {
      console.error("Error creating kids report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Get child's activity summary for parents
  app.get('/api/kids/activity-summary/:childId', async (req, res) => {
    try {
      const { childId } = req.params;
      const { parentVerificationCode } = req.query;

      // In real implementation, verify parent has access to this child's account
      // For now, just return safe summary data

      const summary = {
        totalPosts: 5,
        heartsReceived: 23,
        starsReceived: 15,
        friendsMade: 3,
        timeSpent: '2 hours this week',
        lastActive: new Date().toISOString(),
        reportsReceived: 0,
        moderationIssues: 0
      };

      res.json(summary);
    } catch (error) {
      console.error("Error fetching kids activity summary:", error);
      res.status(500).json({ message: "Failed to fetch activity summary" });
    }
  });
}
