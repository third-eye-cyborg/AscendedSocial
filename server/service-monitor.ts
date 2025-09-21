// Service monitoring and health aggregation system
import { browserlessService } from './browserless-service';
import { BrowserlessAuthService } from './browserless-auth-service';
import { figmaMCPServer } from './figma-mcp-server';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: string;
  responseTime: number;
  details?: any;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: ServiceHealth[];
  timestamp: string;
  uptime: number;
}

class ServiceMonitor {
  private startTime = Date.now();
  private lastHealthCheck: SystemHealth | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start periodic health checks with a delay to allow app startup
    setTimeout(() => {
      this.startPeriodicHealthChecks();
    }, 10000); // Wait 10 seconds before starting health checks
  }

  // Get comprehensive system health
  public async getSystemHealth(): Promise<SystemHealth> {
    const startTime = Date.now();
    console.log('🔍 [SERVICE-MONITOR] Starting comprehensive system health check');

    const services: ServiceHealth[] = [];

    // Check Browserless service (skip in development if no token)
    if (process.env.BROWSERLESS_TOKEN || process.env.NODE_ENV !== 'development') {
      try {
        const browserlessStart = Date.now();
        const browserlessHealth = await browserlessService.healthCheck();
        services.push({
          name: 'browserless',
          status: browserlessHealth.status as any,
          lastCheck: new Date().toISOString(),
          responseTime: Date.now() - browserlessStart,
          details: browserlessHealth
        });
      } catch (error: any) {
        // Check if it's a usage limit error (treat as degraded, not unhealthy)
        const isUsageLimitError = error.message?.includes('usage limit') || 
                                  error.message?.includes('401 Unauthorized') ||
                                  error.message?.includes('upgrade to a paid plan');
        
        services.push({
          name: 'browserless',
          status: isUsageLimitError ? 'degraded' : 'unhealthy',
          lastCheck: new Date().toISOString(),
          responseTime: Date.now() - startTime,
          details: { 
            error: error.message,
            isUsageLimitError,
            note: isUsageLimitError ? 'Service degraded due to usage limits' : undefined
          }
        });
      }
    } else {
      services.push({
        name: 'browserless',
        status: 'degraded',
        lastCheck: new Date().toISOString(),
        responseTime: 0,
        details: { 
          note: 'Browserless health checks disabled in development (no token configured)'
        }
      });
    }

    // Check Browserless Auth service (skip in development if no token)
    if (process.env.BROWSERLESS_TOKEN || process.env.NODE_ENV !== 'development') {
      try {
        const authStart = Date.now();
        const authService = new BrowserlessAuthService();
        const authHealth = await authService.healthCheck();
        services.push({
          name: 'browserless-auth',
          status: authHealth.status as any,
          lastCheck: new Date().toISOString(),
          responseTime: Date.now() - authStart,
          details: authHealth
        });
      } catch (error: any) {
        // Check if it's a usage limit error (treat as degraded, not unhealthy)
        const isUsageLimitError = error.message?.includes('usage limit') || 
                                  error.message?.includes('401 Unauthorized') ||
                                  error.message?.includes('upgrade to a paid plan');
        
        services.push({
          name: 'browserless-auth',
          status: isUsageLimitError ? 'degraded' : 'unhealthy',
          lastCheck: new Date().toISOString(),
          responseTime: Date.now() - startTime,
          details: { 
            error: error.message,
            isUsageLimitError,
            note: isUsageLimitError ? 'Service degraded due to usage limits' : undefined
          }
        });
      }
    } else {
      services.push({
        name: 'browserless-auth',
        status: 'degraded',
        lastCheck: new Date().toISOString(),
        responseTime: 0,
        details: { 
          note: 'Browserless auth health checks disabled in development (no token configured)'
        }
      });
    }

    // Check Figma MCP service
    try {
      const figmaStart = Date.now();
      let figmaHealth;
      
      if (figmaMCPServer) {
        // Simple availability check instead of healthCheck method
        figmaHealth = { success: true, message: 'Figma MCP server initialized' };
      } else {
        figmaHealth = { success: false, error: 'Service not initialized' };
      }
      
      services.push({
        name: 'figma-mcp',
        status: figmaHealth.success ? 'healthy' : 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - figmaStart,
        details: figmaHealth
      });
    } catch (error: any) {
      services.push({
        name: 'figma-mcp',
        status: 'unhealthy',
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        details: { error: error.message }
      });
    }

    // Determine overall system health
    const healthyServices = services.filter(s => s.status === 'healthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;
    
    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyServices === services.length) {
      overall = 'healthy';
    } else if (healthyServices > 0 || degradedServices > 0) {
      overall = 'degraded';
    } else {
      overall = 'unhealthy';
    }

    const systemHealth: SystemHealth = {
      overall,
      services,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime
    };

    this.lastHealthCheck = systemHealth;
    
    const totalTime = Date.now() - startTime;
    console.log(`📊 [SERVICE-MONITOR] System health check completed in ${totalTime}ms - Overall: ${overall}`);
    
    return systemHealth;
  }

  // Get cached health if recent, otherwise perform new check
  public async getCachedOrFreshHealth(maxAge: number = 30000): Promise<SystemHealth> {
    if (this.lastHealthCheck) {
      const age = Date.now() - new Date(this.lastHealthCheck.timestamp).getTime();
      if (age < maxAge) {
        console.log(`⚡ [SERVICE-MONITOR] Returning cached health (${age}ms old)`);
        return this.lastHealthCheck;
      }
    }
    
    return this.getSystemHealth();
  }

  // Start periodic health checks
  private startPeriodicHealthChecks(interval: number = 60000): void {
    console.log(`🔄 [SERVICE-MONITOR] Starting periodic health checks every ${interval}ms`);
    
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.getSystemHealth();
      } catch (error) {
        console.error('❌ [SERVICE-MONITOR] Periodic health check failed:', error);
      }
    }, interval);
  }

  // Stop periodic health checks
  public stopPeriodicHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('🛑 [SERVICE-MONITOR] Stopped periodic health checks');
    }
  }

  // Get service-specific metrics
  public getServiceMetrics(): {
    totalServices: number;
    healthyServices: number;
    degradedServices: number;
    unhealthyServices: number;
    uptime: number;
  } {
    const services = this.lastHealthCheck?.services || [];
    
    return {
      totalServices: services.length,
      healthyServices: services.filter(s => s.status === 'healthy').length,
      degradedServices: services.filter(s => s.status === 'degraded').length,
      unhealthyServices: services.filter(s => s.status === 'unhealthy').length,
      uptime: Date.now() - this.startTime
    };
  }
}

export const serviceMonitor = new ServiceMonitor();
export { ServiceMonitor, type ServiceHealth, type SystemHealth };