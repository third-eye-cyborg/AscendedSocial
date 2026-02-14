import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  isAdmin: true;
}

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAdminAuth(): AdminAuthState & {
  logout: () => void;
  refetch: () => void;
} {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Query to get current admin user with custom queryFn that handles 401 gracefully
  const {
    data: adminData,
    isLoading,
    error: queryError,
    refetch
  } = useQuery<AdminUser | null>({
    queryKey: ['/api/admin/user'],
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      try {
        const response = await fetch("/api/admin/user", {
          credentials: "include",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // User not authenticated as admin, return null instead of throwing
            return null;
          }
          throw new Error(`Admin auth check failed: ${response.status}`);
        }
        
        return response.json();
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
          console.warn('⚠️ Admin auth check timed out');
          return null;
        }
        throw err;
      }
    },
  });

  // Type guard to ensure we have valid admin data
  const admin: AdminUser | null = adminData && typeof adminData === 'object' && 'isAdmin' in adminData && adminData.isAdmin
    ? adminData as AdminUser
    : null;

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      const errorMessage = queryError.message || 'Admin authentication failed';
      setError(errorMessage);
    } else {
      setError(null);
    }
  }, [queryError]);

  const isAuthenticated = Boolean(admin?.isAdmin);

  const logout = () => {
    // Clear all admin queries from cache
    queryClient.removeQueries({ queryKey: ['/api/admin'] });
    
    // Redirect to admin logout endpoint
    window.location.href = "/api/admin/logout";
  };

  return {
    admin,
    isAuthenticated,
    isLoading,
    error,
    logout,
    refetch
  };
}

// Hook for checking admin permissions
export function useAdminPermissions() {
  const { admin, isAuthenticated } = useAdminAuth();

  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !admin) return false;
    
    // For now, all admins have all permissions
    // This can be extended to support role-based permissions later
    return true;
  };

  const canAccessAnalytics = () => hasPermission('analytics');
  const canModerateContent = () => hasPermission('moderation');
  const canManageUsers = () => hasPermission('users');
  const canAccessTickets = () => hasPermission('tickets');
  const canAccessSystem = () => hasPermission('system');

  return {
    hasPermission,
    canAccessAnalytics,
    canModerateContent,
    canManageUsers,
    canAccessTickets,
    canAccessSystem
  };
}