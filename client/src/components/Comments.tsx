import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username?: string;
    email?: string;
    sigil?: string;
  };
}

interface CommentsProps {
  postId: string;
  isVisible: boolean;
}

export default function Comments({ postId, isVisible }: CommentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["/api/posts", postId, "comments"],
    enabled: isVisible,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", `/api/posts/${postId}/comments`, { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts", postId, "comments"] });
      setNewComment("");
      toast({
        title: "Comment Added",
        description: "Your spiritual insight has been shared",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add comments",
        variant: "destructive",
      });
      return;
    }

    createCommentMutation.mutate(newComment.trim());
  };

  if (!isVisible) return null;

  return (
    <div className="mt-4 border-t border-primary/20 pt-4">
      {/* Comments List */}
      <div className="space-y-4 mb-4">
        {isLoading && 
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex space-x-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          )) as React.ReactNode
        }

        {!isLoading && comments && Array.isArray(comments) && comments.length > 0 && 
          (comments as Comment[]).map((comment) => (
            <div key={comment.id} className="flex space-x-3" data-testid={`comment-${comment.id}`}>
              {/* Comment Author Sigil */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-cosmic border border-primary/30 flex items-center justify-center overflow-hidden">
                  {comment.author?.sigil ? (
                    <span className="text-[10px] text-white font-mono text-center break-all" data-testid={`text-comment-sigil-${comment.id}`}>
                      {(comment.author.sigil as string).slice(0, 3)}
                    </span>
                  ) : (
                    <i className="fas fa-user text-xs text-muted"></i>
                  )}
                </div>
              </div>
              
              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-white" data-testid={`text-comment-author-${comment.id}`}>
                    {comment.author?.username || comment.author?.email || 'Spiritual Seeker'}
                  </span>
                  <span className="text-xs text-white/60" data-testid={`text-comment-time-${comment.id}`}>
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-white/90 leading-relaxed" data-testid={`text-comment-content-${comment.id}`}>
                  {comment.content}
                </p>
                
                {/* Comment Actions */}
                <div className="flex items-center space-x-4 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert('Like comment feature coming soon! ❤️✨')}
                    className="text-white/70 hover:text-accent text-xs p-1 h-auto transition-colors"
                    data-testid={`button-comment-like-${comment.id}`}
                  >
                    <i className="fas fa-heart mr-1"></i>
                    Like
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert('Reply to comment feature coming soon! 💬✨')}
                    className="text-white/70 hover:text-secondary text-xs p-1 h-auto transition-colors"
                    data-testid={`button-comment-reply-${comment.id}`}
                  >
                    <i className="fas fa-reply mr-1"></i>
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )) as React.ReactNode
        }

        {!isLoading && (!comments || !Array.isArray(comments) || comments.length === 0) && (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
              <i className="fas fa-comments text-primary text-xl"></i>
            </div>
            <p className="text-sm text-muted">No comments yet</p>
            <p className="text-xs text-muted mt-1">Be the first to share your thoughts</p>
          </div>
        )}
      </div>

      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="border-t border-primary/10 pt-4">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-cosmic border border-primary/30 flex items-center justify-center overflow-hidden">
                {(user as any)?.sigil ? (
                  <span className="text-[10px] text-white font-mono text-center break-all" data-testid="text-user-sigil-comment">
                    {((user as any)?.sigil as string).slice(0, 3)}
                  </span>
                ) : (
                  <i className="fas fa-user text-xs text-muted"></i>
                )}
              </div>
            </div>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your spiritual insight..."
                className="bg-cosmic-light border-primary/30 text-white placeholder:text-muted resize-none min-h-20"
                data-testid="textarea-new-comment"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted">
                  {newComment.length}/500 characters
                </span>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewComment("")}
                    className="text-muted hover:text-white"
                    data-testid="button-cancel-comment"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newComment.trim() || createCommentMutation.isPending}
                    className="bg-primary hover:bg-primary/80 text-white"
                    data-testid="button-submit-comment"
                  >
                    {createCommentMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Posting...
                      </div>
                    ) : (
                      "Comment"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Login prompt for non-authenticated users */}
      {!user && (
        <div className="border-t border-primary/10 pt-4 text-center">
          <p className="text-sm text-muted mb-3">Join the spiritual conversation</p>
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-primary hover:bg-primary/80 text-white"
            data-testid="button-login-to-comment"
          >
            Login to Comment
          </Button>
        </div>
      )}
    </div>
  );
}