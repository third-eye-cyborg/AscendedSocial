import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

interface MobileAuthConfig {
  clientId: string;
  apiBaseUrl: string;
  redirectUri: string;
  deepLinkScheme: string;
  issuerUrl: string;
  scopes: string[];
}

interface AuthTokenPayload {
  userId: string;
  email: string;
  claims: any;
  expires_at: number;
}

export class MobileAuthHandler {
  private config: MobileAuthConfig | null = null;
  private isInitialized = false;

  // Initialize the authentication handler
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Determine API base URL based on environment
      const API_BASE_URL = this.getApiBaseUrl();
      
      console.log('🔧 Initializing mobile auth with API:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/mobile-config`);
      if (!response.ok) {
        throw new Error(`Failed to fetch mobile auth config: ${response.status}`);
      }

      this.config = await response.json();
      this.isInitialized = true;
      
      // Set up deep link listener
      this.setupDeepLinkListener();
      
      console.log('✅ Mobile auth handler initialized:', {
        replitClientId: this.config?.replitClientId ? '***' : 'missing',
        backendDomain: this.config?.backendDomain,
        mobileAppDomain: this.config?.mobileAppDomain,
        features: this.config?.features
      });
    } catch (error) {
      console.error('❌ Failed to initialize mobile auth:', error);
      throw error;
    }
  }

  // Determine the correct API base URL
  private getApiBaseUrl(): string {
    // Check if running in web environment
    if (typeof window !== 'undefined') {
      // If in browser, use current origin
      return window.location.origin;
    }
    
    // For React Native, use the backend domain
    return process.env.EXPO_PUBLIC_API_URL || 'https://your-backend-domain.replit.dev';
  }

  // Set up deep link listener for authentication callbacks
  private setupDeepLinkListener(): void {
    Linking.addEventListener('url', this.handleDeepLink.bind(this));
    
    // Handle app launch via deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        this.handleDeepLink({ url });
      }
    });
  }

  // Handle incoming deep link URLs
  private async handleDeepLink(event: { url: string }): Promise<void> {
    const url = event.url;
    console.log('🔗 Received deep link:', url);

    if (!this.config || !url.startsWith(this.config.deepLinkScheme)) {
      return;
    }

    // Parse authentication callback
    if (url.includes('auth/callback')) {
      await this.handleAuthCallback(url);
    }
  }

  // Handle authentication callback from Replit
  private async handleAuthCallback(url: string): Promise<void> {
    try {
      const urlParts = new URL(url);
      const token = urlParts.searchParams.get('token');
      const success = urlParts.searchParams.get('success');

      if (!token || success !== 'true') {
        throw new Error('Invalid authentication callback');
      }

      // Verify token with backend
      const isValid = await this.verifyToken(token);
      if (isValid) {
        await this.storeAuthToken(token);
        console.log('✅ Authentication successful! User logged in.');
        
        // Notify app of successful authentication
        this.notifyAuthSuccess();
      } else {
        throw new Error('Token verification failed');
      }

    } catch (error) {
      console.error('❌ Authentication callback failed:', error);
      this.notifyAuthError(error as Error);
    }
  }

  // Verify JWT token with backend
  private async verifyToken(token: string): Promise<boolean> {
    if (!this.config) return false;

    try {
      const response = await fetch(`${this.config.backendDomain}/api/auth/mobile-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const result = await response.json();
      
      console.log('🔍 Token verification result:', {
        status: response.status,
        success: result.success,
        valid: result.valid
      });
      
      return response.ok && result.success && result.valid;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return false;
    }
  }

  // Store authentication token securely
  private async storeAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('auth_timestamp', Date.now().toString());
    } catch (error) {
      console.error('Failed to store auth token:', error);
      throw error;
    }
  }

  // Initiate authentication flow
  async login(): Promise<void> {
    if (!this.config) {
      throw new Error('Auth handler not initialized');
    }

    try {
      // Check if running in web environment (Expo web or browser)
      const isWeb = typeof window !== 'undefined' && !window.ReactNativeWebView;
      
      if (isWeb) {
        // For web, call mobile-login with platform detection
        const currentDomain = window.location.origin;
        const authUrl = `${this.config.backendDomain}/api/auth/mobile-login?platform=web&redirect_uri=${encodeURIComponent(currentDomain)}`;
        
        console.log('🌐 Starting web authentication flow:', {
          currentDomain,
          authUrl
        });
        
        window.location.href = authUrl;
      } else {
        // For mobile app, use deep link callback
        const authUrl = `${this.config.backendDomain}/api/auth/mobile-login?platform=native&redirect_uri=${encodeURIComponent(this.config.deepLinkScheme + 'auth/callback')}`;
        
        console.log('📱 Starting mobile app authentication flow:', {
          deepLinkScheme: this.config.deepLinkScheme,
          authUrl
        });
        
        const supported = await Linking.canOpenURL(authUrl);
        if (supported) {
          await Linking.openURL(authUrl);
        } else {
          throw new Error('Cannot open authentication URL');
        }
      }
    } catch (error) {
      console.error('❌ Failed to start authentication:', error);
      throw error;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'auth_timestamp']);
      console.log('🔓 User logged out');
      this.notifyAuthLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return false;

      // Optionally verify token is still valid
      return await this.verifyToken(token);
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  // Get stored authentication token
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  // Notify app of successful authentication
  private notifyAuthSuccess(): void {
    // Emit custom event or use state management
    // For now, just log success
    console.log('🎉 Authentication success notification');
  }

  // Notify app of authentication error
  private notifyAuthError(error: Error): void {
    console.error('🚨 Authentication error notification:', error.message);
  }

  // Notify app of logout
  private notifyAuthLogout(): void {
    console.log('👋 Logout notification');
  }
}

// Export singleton instance
export const mobileAuthHandler = new MobileAuthHandler();

// React Native hook for authentication
export const useMobileAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await mobileAuthHandler.initialize();
        const authenticated = await mobileAuthHandler.isAuthenticated();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      await mobileAuthHandler.login();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await mobileAuthHandler.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};