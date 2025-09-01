import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, BellOff, Sparkles, Users, Zap, Moon } from 'lucide-react';
import { NotificationService } from '@/lib/notifications';
import { ClientAnalytics } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';

interface NotificationPromptProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  className?: string;
}

export function NotificationPrompt({ 
  onPermissionGranted, 
  onPermissionDenied, 
  className 
}: NotificationPromptProps) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    const status = await NotificationService.getPermissionStatus();
    setPermission(status);
    
    // Show prompt if permission is default and notifications are supported
    setIsVisible(status === 'default' && NotificationService.isSupported());
  };

  const handleRequestPermission = async () => {
    setIsLoading(true);
    
    try {
      const granted = await NotificationService.requestPermission('spiritual_journey');
      
      if (granted) {
        setPermission('granted');
        setIsVisible(false);
        onPermissionGranted?.();
        
        toast({
          title: "🌟 Notifications Enabled!",
          description: "You'll receive spiritual insights, oracle guidance, and community updates.",
          duration: 5000,
        });
        
        ClientAnalytics.trackAction('spiritual_notifications_enabled', 'spiritual', {
          source: 'permission_prompt',
          permission_granted: true
        });
      } else {
        setPermission('denied');
        onPermissionDenied?.();
        
        toast({
          title: "Notifications Disabled",
          description: "You can enable them later in your browser settings or profile.",
          variant: "destructive",
        });
        
        ClientAnalytics.trackAction('spiritual_notifications_denied', 'spiritual', {
          source: 'permission_prompt',
          permission_granted: false
        });
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      toast({
        title: "Permission Error",
        description: "Unable to request notification permission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    ClientAnalytics.trackAction('notification_prompt_dismissed', 'spiritual', {
      permission_status: permission
    });
  };

  const handleShowPrompt = async () => {
    await NotificationService.showSpiritualPrompt();
  };

  if (!isVisible && permission === 'default') {
    return (
      <Button 
        onClick={handleShowPrompt}
        variant="outline" 
        className={`${className} bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-700 hover:from-purple-900/30 hover:to-blue-900/30 text-white`}
        data-testid="button-show-notification-prompt"
      >
        <Bell className="w-4 h-4 mr-2" />
        Enable Notifications
      </Button>
    );
  }

  if (!isVisible || permission !== 'default') {
    return null;
  }

  return (
    <Card className={`${className} bg-cosmic-light border border-primary/30 backdrop-blur-xl shadow-2xl shadow-purple-500/20 glass-effect hover-lift rounded-xl`} data-testid="card-notification-prompt">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full shadow-lg">
            <Bell className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Stay Connected to Your Spiritual Journey
        </CardTitle>
        <CardDescription className="text-lg text-gray-300">
          Receive personalized guidance, community insights, and energy updates on your path to enlightenment.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <div>
              <h4 className="font-semibold text-gray-200">Oracle Readings</h4>
              <p className="text-sm text-gray-400">Daily wisdom and spiritual guidance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <Users className="w-6 h-6 text-blue-500" />
            <div>
              <h4 className="font-semibold text-gray-200">Community Updates</h4>
              <p className="text-sm text-gray-400">New posts and spiritual discussions</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <Zap className="w-6 h-6 text-yellow-500" />
            <div>
              <h4 className="font-semibold text-gray-200">Energy Milestones</h4>
              <p className="text-sm text-gray-400">Celebrate your spiritual progress</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
            <Moon className="w-6 h-6 text-indigo-500" />
            <div>
              <h4 className="font-semibold text-gray-200">Vision Insights</h4>
              <p className="text-sm text-gray-400">Manifestations and dream guidance</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-purple-700/30">
          <p className="text-sm text-gray-300 text-center">
            ✨ Notifications are personalized based on your spiritual interests and can be disabled anytime.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleRequestPermission}
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          data-testid="button-enable-notifications"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Enabling...
            </>
          ) : (
            <>
              <Bell className="w-4 h-4 mr-2" />
              Enable Spiritual Notifications
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleDismiss}
          variant="outline"
          className="flex-1 sm:flex-none bg-gray-800/70 border-gray-600 hover:bg-gray-700/90 text-gray-200 backdrop-blur-sm"
          data-testid="button-dismiss-prompt"
        >
          <BellOff className="w-4 h-4 mr-2" />
          Maybe Later
        </Button>
      </CardFooter>
    </Card>
  );
}

// Notification status indicator component
export function NotificationStatus() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    subscribed: boolean;
    playerId?: string;
  }>({ subscribed: false });

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const permissionStatus = await NotificationService.getPermissionStatus();
    const subscription = await NotificationService.getSubscriptionStatus();
    
    setPermission(permissionStatus);
    setSubscriptionStatus(subscription);
  };

  const getStatusInfo = () => {
    if (!NotificationService.isSupported()) {
      return {
        icon: <BellOff className="w-4 h-4 text-gray-400" />,
        text: 'Not Supported',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100'
      };
    }

    if (permission === 'granted' && subscriptionStatus.subscribed) {
      return {
        icon: <Bell className="w-4 h-4 text-green-600" />,
        text: 'Enabled',
        color: 'text-green-700',
        bgColor: 'bg-green-100'
      };
    }

    if (permission === 'denied') {
      return {
        icon: <BellOff className="w-4 h-4 text-red-600" />,
        text: 'Disabled',
        color: 'text-red-700',
        bgColor: 'bg-red-100'
      };
    }

    return {
      icon: <Bell className="w-4 h-4 text-yellow-600" />,
      text: 'Available',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100'
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`} data-testid="status-notifications">
      {statusInfo.icon}
      <span className={`text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    </div>
  );
}

export default NotificationPrompt;