import { ClientAnalytics } from './analytics';

const ONESIGNAL_APP_ID = import.meta.env.VITE_ONESIGNAL_APP_ID;

// Global OneSignal types
declare global {
  interface Window {
    OneSignal?: any;
    OneSignalDeferred?: any[];
  }
}

export interface PushNotificationOptions {
  title: string;
  message: string;
  url?: string;
  icon?: string;
  image?: string;
  userId?: string;
  tags?: Record<string, string>;
  spiritualCategory?: 'oracle' | 'community' | 'energy' | 'vision' | 'general';
}

export class NotificationService {
  private static initialized = false;
  private static initializationPromise: Promise<void> | null = null;

  // Initialize OneSignal for the spiritual platform
  static async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._initialize();
    return this.initializationPromise;
  }

  private static async _initialize(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') {
      return;
    }

    // Validate OneSignal App ID is configured
    if (!ONESIGNAL_APP_ID) {
      console.error('❌ VITE_ONESIGNAL_APP_ID environment variable is required for OneSignal integration');
      throw new Error('OneSignal App ID not configured');
    }

    try {
      // Load OneSignal script dynamically
      await this.loadOneSignalScript();
      
      // Initialize with deferred pattern and wait for completion
      await new Promise<void>((resolve, reject) => {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async (OneSignal: any) => {
          try {
            await OneSignal.init({
              appId: ONESIGNAL_APP_ID,
              allowLocalhostAsSecureOrigin: true,
            });
            
            // Set up event listeners
            this.setupEventListeners();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      this.initialized = true;
      
      console.log('✨ OneSignal initialized for spiritual platform');
      
      // Track initialization
      ClientAnalytics.trackAction('push_notifications_initialized', 'spiritual', {
        app_id: ONESIGNAL_APP_ID,
        platform: 'web'
      });

    } catch (error) {
      console.error('OneSignal initialization failed:', error);
      ClientAnalytics.trackError(error as Error, {
        context: 'onesignal_init',
        app_id: ONESIGNAL_APP_ID
      });
      throw error;
    }
  }

  // Load OneSignal script
  private static async loadOneSignalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="OneSignalSDK"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load OneSignal script'));
      
      document.head.appendChild(script);
    });
  }

  // Set up event listeners for spiritual notifications
  private static setupEventListeners(): void {
    if (typeof window === 'undefined' || !window.OneSignal) return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push((OneSignal: any) => {
      // Notification clicked
      OneSignal.Notifications.addEventListener('click', (event: any) => {
        console.log('🔔 Spiritual notification clicked:', event);
        
        ClientAnalytics.trackAction('push_notification_clicked', 'spiritual', {
          notification_id: event.id,
          url: event.url,
          spiritual_category: event.data?.spiritualCategory
        });
      });

      // Permission changes
      OneSignal.Notifications.addEventListener('permissionChange', (event: any) => {
        console.log('🔐 Notification permission changed:', event);
        
        ClientAnalytics.trackAction('push_permission_changed', 'spiritual', {
          permission: event
        });
      });
    });
  }

  // Request notification permission with spiritual context
  static async requestPermission(spiritualContext?: string): Promise<boolean> {
    await this.initialize();
    
    try {
      if (!this.isSupported()) return false;

      // Use OneSignal API for proper subscription creation
      return new Promise((resolve) => {
        if (typeof window !== 'undefined' && window.OneSignal) {
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          window.OneSignalDeferred.push(async (OneSignal: any) => {
            try {
              // Request permission through OneSignal
              const permission = await OneSignal.Notifications.requestPermission();
              const granted = permission === 'granted';
              
              // Verify subscription was created with proper push subscription check
              let hasSubscription = false;
              let subscriptionInfo = '';
              if (granted) {
                const optedIn = OneSignal.User?.PushSubscription?.optedIn;
                const subscriptionId = OneSignal.User?.PushSubscription?.id;
                const userId = OneSignal.User?.onesignalId;
                
                hasSubscription = optedIn === true && !!subscriptionId;
                subscriptionInfo = `UserId: ${userId}, SubscriptionId: ${subscriptionId}, OptedIn: ${optedIn}`;
                console.log('✅ OneSignal subscription status:', subscriptionInfo);
              }
              
              ClientAnalytics.trackAction('push_permission_requested', 'spiritual', {
                granted,
                has_subscription: hasSubscription,
                spiritual_context: spiritualContext || 'general',
                permission_result: permission
              });

              resolve(granted && hasSubscription);
            } catch (error) {
              console.error('OneSignal permission request failed:', error);
              ClientAnalytics.trackError(error as Error, {
                context: 'onesignal_permission_request',
                spiritual_context: spiritualContext
              });
              resolve(false);
            }
          });
        } else {
          resolve(false);
        }
      });
    } catch (error) {
      console.error('Permission request failed:', error);
      ClientAnalytics.trackError(error as Error, {
        context: 'permission_request',
        spiritual_context: spiritualContext
      });
      return false;
    }
  }

  // Show custom prompt for spiritual notifications
  static async showSpiritualPrompt(): Promise<void> {
    await this.initialize();
    
    try {
      if (typeof window !== 'undefined' && window.OneSignal) {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push((OneSignal: any) => {
          if (OneSignal.Slidedown) {
            OneSignal.Slidedown.promptPush();
          }
        });
      }
      
      ClientAnalytics.trackAction('spiritual_prompt_shown', 'spiritual', {
        prompt_type: 'slidedown'
      });
    } catch (error) {
      console.error('Slidedown prompt failed:', error);
    }
  }

  // Set user spiritual profile for targeted notifications
  static async setSpiritualProfile(userId: string, profile: {
    username?: string;
    dominantChakra?: string;
    auraLevel?: number;
    interests?: string[];
    journeyStage?: string;
    isPremium?: boolean;
  }): Promise<void> {
    await this.initialize();
    
    try {
      if (typeof window !== 'undefined' && window.OneSignal) {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async (OneSignal: any) => {
          // Login user
          await OneSignal.login(userId);
          
          // Set spiritual tags for targeting
          const tags: Record<string, string> = {};
          
          if (profile.username) tags.username = profile.username;
          if (profile.dominantChakra) tags.dominant_chakra = profile.dominantChakra;
          if (profile.auraLevel) tags.aura_level = profile.auraLevel.toString();
          if (profile.journeyStage) tags.journey_stage = profile.journeyStage;
          if (profile.isPremium !== undefined) tags.is_premium = profile.isPremium.toString();
          if (profile.interests) tags.spiritual_interests = profile.interests.join(',');
          
          await OneSignal.User.addTags(tags);
          
          console.log('🧘 Spiritual profile updated for notifications:', tags);
        });
      }
      
      ClientAnalytics.trackAction('spiritual_profile_updated', 'spiritual', {
        user_id: userId,
        has_chakra: !!profile.dominantChakra,
        is_premium: profile.isPremium
      });
    } catch (error) {
      console.error('Failed to set spiritual profile:', error);
      ClientAnalytics.trackError(error as Error, {
        context: 'spiritual_profile_update',
        user_id: userId
      });
    }
  }

  // Get subscription status
  static async getSubscriptionStatus(): Promise<{
    subscribed: boolean;
    playerId?: string;
    permission?: NotificationPermission;
  }> {
    await this.initialize();
    
    try {
      const permission = this.isSupported() ? Notification.permission : 'denied' as NotificationPermission;
      
      // Check actual OneSignal subscription status
      let subscribed = false;
      let playerId: string | undefined;
      
      if (permission === 'granted' && typeof window !== 'undefined' && window.OneSignal) {
        const optedIn = (window as any).OneSignal?.User?.PushSubscription?.optedIn;
        const subscriptionId = (window as any).OneSignal?.User?.PushSubscription?.id;
        const userId = (window as any).OneSignal?.User?.onesignalId;
        
        subscribed = optedIn === true && !!subscriptionId;
        playerId = userId;
      }
      
      return {
        subscribed,
        playerId,
        permission
      };
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      return {
        subscribed: false,
        permission: 'default'
      };
    }
  }

  // Send test notification (for development)
  static async sendTestNotification(options: PushNotificationOptions): Promise<void> {
    console.log('🧪 Test notification would send:', options);
    
    // In development, we just log the notification
    // In production, this would call your backend API
    ClientAnalytics.trackAction('test_notification_sent', 'spiritual', {
      title: options.title,
      spiritual_category: options.spiritualCategory,
      has_url: !!options.url
    });
  }

  // Logout user (for authentication changes)
  static async logout(): Promise<void> {
    await this.initialize();
    
    try {
      if (typeof window !== 'undefined' && window.OneSignal) {
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async (OneSignal: any) => {
          await OneSignal.logout();
          console.log('👋 OneSignal user logged out');
        });
      }
    } catch (error) {
      console.error('OneSignal logout failed:', error);
    }
  }

  // Get player ID for server-side notifications
  static async getPlayerId(): Promise<string | null> {
    await this.initialize();
    
    try {
      return new Promise((resolve) => {
        if (typeof window !== 'undefined' && window.OneSignal) {
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          window.OneSignalDeferred.push((OneSignal: any) => {
            resolve(OneSignal.User?.onesignalId || null);
          });
        } else {
          resolve(null);
        }
      });
    } catch (error) {
      console.error('Failed to get player ID:', error);
      return null;
    }
  }

  // Check if notifications are supported
  static isSupported(): boolean {
    return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  }

  // Get notification permission status
  static async getPermissionStatus(): Promise<NotificationPermission | 'unsupported'> {
    if (!this.isSupported()) return 'unsupported';
    
    try {
      return Notification.permission;
    } catch (error) {
      return 'default';
    }
  }
}

// Spiritual notification presets
export const SpiritualNotificationPresets = {
  oracleReading: (username: string): PushNotificationOptions => ({
    title: '🔮 Your Daily Oracle Awaits',
    message: `${username}, your personalized spiritual guidance is ready to illuminate your path.`,
    spiritualCategory: 'oracle',
    icon: '/icons/oracle-icon.png'
  }),

  communityPost: (authorName: string, chakraType?: string): PushNotificationOptions => ({
    title: '✨ New Spiritual Insight',
    message: `${authorName} shared wisdom in the ${chakraType || 'spiritual'} community.`,
    spiritualCategory: 'community',
    icon: '/icons/community-icon.png'
  }),

  energyMilestone: (level: number): PushNotificationOptions => ({
    title: '⚡ Energy Milestone Achieved!',
    message: `Congratulations! You've reached aura level ${level} in your spiritual journey.`,
    spiritualCategory: 'energy',
    icon: '/icons/energy-icon.png'
  }),

  visionShared: (visionType: string): PushNotificationOptions => ({
    title: '🌙 New Vision Manifested',
    message: `A powerful ${visionType} vision has been shared by your spiritual community.`,
    spiritualCategory: 'vision',
    icon: '/icons/vision-icon.png'
  })
};

export default NotificationService;