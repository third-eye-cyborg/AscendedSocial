import { AnalyticsService } from './analytics';

const ONESIGNAL_APP_ID = '8252cea5-144a-4c8d-b2d4-ca5c606f6ce0';
const ONESIGNAL_API_URL = 'https://onesignal.com/api/v1/notifications';

export interface ServerNotificationOptions {
  title: string;
  message: string;
  url?: string;
  icon?: string;
  image?: string;
  
  // Targeting options
  userIds?: string[];
  tags?: Record<string, string>;
  segments?: string[];
  
  // Spiritual categorization
  spiritualCategory?: 'oracle' | 'community' | 'energy' | 'vision' | 'general';
  chakraType?: 'root' | 'sacral' | 'solar' | 'heart' | 'throat' | 'third_eye' | 'crown';
  
  // Advanced options
  sendAfter?: Date;
  buttons?: Array<{
    id: string;
    text: string;
    url?: string;
  }>;
  
  // Analytics
  analyticsData?: Record<string, any>;
}

export class ServerNotificationService {
  private static restApiKey: string | undefined = process.env.ONESIGNAL_REST_API_KEY;

  // Send notification to specific users
  static async sendToUsers(userIds: string[], options: ServerNotificationOptions): Promise<{
    success: boolean;
    notificationId?: string;
    error?: string;
  }> {
    if (!this.restApiKey) {
      console.error('OneSignal REST API key not configured');
      return { success: false, error: 'OneSignal not configured' };
    }

    const payload = this.buildNotificationPayload({
      ...options,
      userIds
    });

    try {
      const response = await fetch(ONESIGNAL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${this.restApiKey}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (response.ok) {
        // Track successful notification
        await AnalyticsService.track({
          event: 'push_notification_sent',
          distinctId: 'system',
          properties: {
            notification_id: result.id,
            recipient_count: userIds.length,
            spiritual_category: options.spiritualCategory || 'general',
            chakra_type: options.chakraType,
            title: options.title,
            success: true
          }
        });

        console.log(`✅ Notification sent successfully: ${result.id}`);
        return {
          success: true,
          notificationId: result.id
        };
      } else {
        console.error('OneSignal API error:', result);
        return {
          success: false,
          error: result.errors?.[0] || 'Unknown error'
        };
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
      
      // Track failed notification
      await AnalyticsService.trackError(
        null,
        error as Error,
        {
          context: 'push_notification_send',
          recipient_count: userIds.length,
          spiritual_category: options.spiritualCategory
        }
      );

      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  // Send notification to users with specific tags
  static async sendToTaggedUsers(tags: Record<string, string>, options: ServerNotificationOptions): Promise<{
    success: boolean;
    notificationId?: string;
    error?: string;
  }> {
    return this.sendToUsers([], { ...options, tags });
  }

  // Send notification to all subscribed users
  static async sendToAllUsers(options: ServerNotificationOptions): Promise<{
    success: boolean;
    notificationId?: string;
    error?: string;
  }> {
    return this.sendToUsers([], { ...options, segments: ['Subscribed Users'] });
  }

  // Spiritual notification presets for server-side sending
  static async sendOracleReading(userId: string, oracleData: {
    reading: string;
    chakra?: string;
    username?: string;
  }): Promise<void> {
    await this.sendToUsers([userId], {
      title: '🔮 Your Oracle Reading is Ready',
      message: `${oracleData.username || 'Seeker'}, your spiritual guidance awaits. Tap to receive your wisdom.`,
      url: '/oracle',
      icon: '/icons/oracle-notification.png',
      spiritualCategory: 'oracle',
      chakraType: oracleData.chakra as any,
      analyticsData: {
        reading_type: 'daily_oracle',
        chakra: oracleData.chakra
      }
    });
  }

  // Send community engagement notification
  static async sendCommunityNotification(targetUserIds: string[], postData: {
    authorName: string;
    postTitle: string;
    chakraType?: string;
    postId: string;
  }): Promise<void> {
    await this.sendToUsers(targetUserIds, {
      title: '✨ New Spiritual Wisdom',
      message: `${postData.authorName} shared: "${postData.postTitle.slice(0, 50)}${postData.postTitle.length > 50 ? '...' : ''}"`,
      url: `/post/${postData.postId}`,
      icon: '/icons/community-notification.png',
      spiritualCategory: 'community',
      chakraType: postData.chakraType as any,
      analyticsData: {
        post_id: postData.postId,
        author_name: postData.authorName,
        engagement_type: 'new_post'
      }
    });
  }

  // Send energy milestone notification
  static async sendEnergyMilestone(userId: string, milestoneData: {
    newLevel: number;
    achievement: string;
    username?: string;
  }): Promise<void> {
    await this.sendToUsers([userId], {
      title: '⚡ Spiritual Milestone Achieved!',
      message: `Congratulations ${milestoneData.username || 'Seeker'}! You've reached ${milestoneData.achievement}.`,
      url: '/energy',
      icon: '/icons/energy-notification.png',
      spiritualCategory: 'energy',
      buttons: [
        {
          id: 'view_progress',
          text: 'View Progress',
          url: '/energy'
        }
      ],
      analyticsData: {
        milestone_type: 'energy_level',
        new_level: milestoneData.newLevel,
        achievement: milestoneData.achievement
      }
    });
  }

  // Send vision-related notification
  static async sendVisionNotification(targetUserIds: string[], visionData: {
    creatorName: string;
    visionTitle: string;
    visionType: 'meditation' | 'prophecy' | 'dream' | 'manifestation';
    visionId: string;
  }): Promise<void> {
    await this.sendToUsers(targetUserIds, {
      title: '🌙 New Vision Shared',
      message: `${visionData.creatorName} manifested: "${visionData.visionTitle}"`,
      url: `/visions/${visionData.visionId}`,
      icon: '/icons/vision-notification.png',
      image: `/api/visions/${visionData.visionId}/thumbnail`,
      spiritualCategory: 'vision',
      analyticsData: {
        vision_id: visionData.visionId,
        vision_type: visionData.visionType,
        creator_name: visionData.creatorName
      }
    });
  }

  // Send chakra-specific notifications to interested users
  static async sendChakraNotification(chakraType: string, options: ServerNotificationOptions): Promise<void> {
    await this.sendToTaggedUsers(
      { dominant_chakra: chakraType },
      {
        ...options,
        chakraType: chakraType as any,
        icon: `/icons/chakra-${chakraType}.png`
      }
    );
  }

  // Send premium user notifications
  static async sendPremiumNotification(options: ServerNotificationOptions): Promise<void> {
    await this.sendToTaggedUsers(
      { is_premium: 'true' },
      {
        ...options,
        icon: '/icons/premium-notification.png'
      }
    );
  }

  // Build OneSignal notification payload
  private static buildNotificationPayload(options: ServerNotificationOptions): any {
    const payload: any = {
      app_id: ONESIGNAL_APP_ID,
      headings: { en: options.title },
      contents: { en: options.message },
    };

    // Targeting
    if (options.userIds && options.userIds.length > 0) {
      payload.include_external_user_ids = options.userIds;
    }

    if (options.tags && Object.keys(options.tags).length > 0) {
      payload.filters = Object.entries(options.tags).map(([key, value]) => ({
        field: 'tag',
        key,
        relation: '=',
        value
      }));
    }

    if (options.segments && options.segments.length > 0) {
      payload.included_segments = options.segments;
    }

    // Rich media
    if (options.url) {
      payload.url = options.url;
    }

    if (options.icon) {
      payload.small_icon = options.icon;
      payload.large_icon = options.icon;
    }

    if (options.image) {
      payload.big_picture = options.image;
      payload.ios_attachments = { id: options.image };
    }

    // Buttons
    if (options.buttons && options.buttons.length > 0) {
      payload.buttons = options.buttons;
    }

    // Scheduling
    if (options.sendAfter) {
      payload.send_after = options.sendAfter.toISOString();
    }

    // Additional data for analytics
    payload.data = {
      spiritual_category: options.spiritualCategory || 'general',
      chakra_type: options.chakraType,
      ...options.analyticsData
    };

    return payload;
  }

  // Get notification statistics
  static async getNotificationStats(notificationId: string): Promise<any> {
    if (!this.restApiKey) {
      return null;
    }

    try {
      const response = await fetch(`https://onesignal.com/api/v1/notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`, {
        headers: {
          'Authorization': `Basic ${this.restApiKey}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Failed to get notification stats:', error);
      return null;
    }
  }
}

export default ServerNotificationService;