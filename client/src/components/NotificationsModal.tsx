import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  userId: string;
  type: 'comment' | 'engagement' | 'oracle' | 'profile_view';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
  relatedType?: 'post' | 'user' | 'comment';
  triggerUser?: {
    id: string;
    username?: string;
    email?: string;
    sigil?: string;
  };
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["/api/notifications"],
    enabled: isOpen,
    retry: false,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => 
      apiRequest(`/api/notifications/${notificationId}/read`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => apiRequest("/api/notifications/mark-all-read", "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    },
  });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    // Navigate based on notification type
    if (notification.relatedType === 'post' && notification.relatedId) {
      // For now, just close modal. In a full implementation, 
      // we'd navigate to the specific post
      onClose();
    } else if (notification.relatedType === 'user' && notification.relatedId) {
      window.location.href = `/profile/${notification.relatedId}`;
    } else {
      onClose();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <i className="fas fa-comment text-blue-400"></i>;
      case 'engagement':
        return <i className="fas fa-heart text-red-400"></i>;
      case 'oracle':
        return <i className="fas fa-eye text-purple-400"></i>;
      case 'profile_view':
        return <i className="fas fa-user text-green-400"></i>;
      default:
        return <i className="fas fa-bell text-muted"></i>;
    }
  };

  const filteredNotifications = notifications && Array.isArray(notifications) 
    ? (notifications as Notification[]).filter(n => 
        filter === "all" || (filter === "unread" && !n.isRead)
      )
    : [];

  const unreadCount = notifications && Array.isArray(notifications)
    ? (notifications as Notification[]).filter(n => !n.isRead).length
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cosmic-light border-primary/30 max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white font-display flex items-center justify-between">
            <span>Spiritual Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                {unreadCount} unread
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className={`${filter === "all" ? "bg-primary text-white" : "border-primary/50 text-primary hover:bg-primary/10"}`}
                data-testid="filter-all-notifications"
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
                className={`${filter === "unread" ? "bg-primary text-white" : "border-primary/50 text-primary hover:bg-primary/10"}`}
                data-testid="filter-unread-notifications"
              >
                Unread ({unreadCount})
              </Button>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="text-muted hover:text-white"
                data-testid="button-mark-all-read"
              >
                <i className="fas fa-check-double mr-2"></i>
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-cosmic rounded-lg p-4 border border-primary/20">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-400 text-xl"></i>
                </div>
                <p className="text-muted">Failed to load notifications</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-cosmic rounded-lg p-4 border cursor-pointer transition-all duration-200 ${
                    notification.isRead 
                      ? 'border-primary/20 hover:border-primary/30 opacity-75' 
                      : 'border-primary/40 hover:border-primary/60 bg-cosmic-light/30'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Trigger User Avatar (if applicable) */}
                    {notification.triggerUser && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-cosmic-light border border-primary/30 flex items-center justify-center">
                          {notification.triggerUser.sigil ? (
                            <span className="text-xs text-white font-mono">
                              {notification.triggerUser.sigil}
                            </span>
                          ) : (
                            <i className="fas fa-user text-xs text-muted"></i>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notification Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-white" data-testid={`notification-title-${notification.id}`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      
                      <p className="text-sm text-subtle mb-2" data-testid={`notification-message-${notification.id}`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                        
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className="text-xs border-primary/50 text-primary"
                          >
                            {notification.type}
                          </Badge>
                          {notification.triggerUser && (
                            <span>by {notification.triggerUser.username || notification.triggerUser.email}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-bell text-primary text-2xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-subtle mb-2">
                  {filter === "unread" ? "All caught up!" : "No notifications yet"}
                </h3>
                <p className="text-muted text-sm">
                  {filter === "unread" 
                    ? "You've read all your notifications" 
                    : "Your spiritual journey notifications will appear here"}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-primary/20 pt-4 flex justify-between items-center">
            <p className="text-xs text-muted">
              Notifications help you stay connected to your spiritual community
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-primary/50 text-primary hover:bg-primary/10"
              data-testid="button-close-notifications"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}