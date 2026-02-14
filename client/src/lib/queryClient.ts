import { QueryClient, QueryFunction } from "@tanstack/react-query";

console.log("📦 Initializing Query Client module...");

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Get stored auth token for mobile authentication
  const authToken = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Get stored auth token for mobile authentication
    const authToken = localStorage.getItem('auth_token');
    
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

let queryClientInstance: QueryClient | null = null;

function createQueryClient(): QueryClient {
  if (queryClientInstance) {
    return queryClientInstance;
  }

  try {
    queryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          queryFn: getQueryFn({ on401: "throw" }),
          refetchInterval: false,
          refetchOnWindowFocus: false,
          staleTime: 5 * 60 * 1000,
          gcTime: 10 * 60 * 1000,
          retry: 1,
          retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
          retry: 1,
          retryDelay: 1000,
        },
      },
    });
    console.log("✅ Query Client created successfully");
    return queryClientInstance;
  } catch (e) {
    console.error("❌ Failed to create Query Client:", e);
    const fallbackClient = new QueryClient();
    queryClientInstance = fallbackClient;
    return fallbackClient;
  }
}

export const queryClient = createQueryClient();
