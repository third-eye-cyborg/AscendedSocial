import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    meta: {
      timeout: 10000, // 10 second timeout
    },
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch("/api/auth/user", {
          credentials: "include",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // User not authenticated, return null instead of throwing
            return null;
          }
          throw new Error(`Authentication check failed: ${response.status}`);
        }
        
        return response.json();
      } catch (err) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
          console.warn('⚠️ Authentication check timed out - treating as unauthenticated');
          return null; // Treat timeout as unauthenticated instead of error
        }
        throw err;
      }
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
