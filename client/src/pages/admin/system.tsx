import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Server, 
  Database,
  Globe,
  Cpu,
  HardDrive,
  MemoryStick,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";

interface SystemHealth {
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  activeServices: number;
  totalServices: number;
  lastHealthCheck: string;
  serviceStatus: {
    name: string;
    status: 'healthy' | 'degraded' | 'down';
    lastCheck: string;
    responseTime: number;
  }[];
  systemMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    activeConnections: number;
  };
  performanceHistory: {
    timestamp: string;
    responseTime: number;
    requests: number;
    errors: number;
  }[];
}

interface ServiceLog {
  id: string;
  service: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  metadata?: any;
}

export default function SystemHealth() {
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds

  // Fetch system health data
  const { data: systemHealth, isLoading, refetch } = useQuery<SystemHealth>({
    queryKey: ['/api/admin/health'],
    refetchInterval: refreshInterval,
  });

  // Fetch system logs
  const { data: systemLogs } = useQuery<ServiceLog[]>({
    queryKey: ['/api/admin/system/logs'],
    refetchInterval: 60000, // 1 minute
  });

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getServiceStatusColor = (status: string) => {
    const colors = {
      healthy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      degraded: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      down: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getLogLevelColor = (level: string) => {
    const colors = {
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      warn: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Health</h1>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading system health...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const healthyServices = systemHealth?.serviceStatus?.filter((s: { status: string }) => s.status === 'healthy').length || 0;
  const totalServices = systemHealth?.serviceStatus?.length || 0;
  const overallHealthPercentage = totalServices > 0 ? (healthyServices / totalServices) * 100 : 0;

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="system-health">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Health</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor system performance and service status</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={overallHealthPercentage >= 90 ? "default" : overallHealthPercentage >= 70 ? "secondary" : "destructive"}>
              <Activity className="w-4 h-4 mr-1" />
              {overallHealthPercentage.toFixed(0)}% Healthy
            </Badge>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {healthyServices}/{totalServices}
              </div>
              <p className="text-xs text-muted-foreground">
                Services operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemHealth?.averageResponseTime || 0}ms
              </div>
              <p className="text-xs text-muted-foreground">
                Average response time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemHealth?.errorRate || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Error rate last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {systemHealth?.totalRequests?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Requests handled today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Health Alert */}
        {overallHealthPercentage < 90 && (
          <Alert variant={overallHealthPercentage < 70 ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {overallHealthPercentage < 70 
                ? "Critical: Multiple services are experiencing issues. Immediate attention required."
                : "Warning: Some services are degraded. Monitor closely."
              }
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
            <TabsTrigger value="metrics" data-testid="tab-metrics">System Metrics</TabsTrigger>
            <TabsTrigger value="performance" data-testid="tab-performance">Performance</TabsTrigger>
            <TabsTrigger value="logs" data-testid="tab-logs">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Current status of all system services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemHealth?.serviceStatus?.map((service: { name: string; status: string; responseTime: number; lastCheck: string }) => (
                    <div key={service.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{service.name}</h3>
                        {getServiceStatusIcon(service.status)}
                      </div>
                      <Badge className={getServiceStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Response: {service.responseTime}ms</p>
                        <p>Last check: {formatDistanceToNow(new Date(service.lastCheck))} ago</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground col-span-full py-8">
                      No service data available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CPU Usage */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {systemHealth?.systemMetrics?.cpuUsage || 0}%
                      </span>
                      <span className={getUsageColor(systemHealth?.systemMetrics?.cpuUsage || 0)}>
                        {systemHealth?.systemMetrics?.cpuUsage || 0 > 50 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </span>
                    </div>
                    <Progress value={systemHealth?.systemMetrics?.cpuUsage || 0} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Memory Usage */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  <MemoryStick className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {systemHealth?.systemMetrics?.memoryUsage || 0}%
                      </span>
                      <span className={getUsageColor(systemHealth?.systemMetrics?.memoryUsage || 0)}>
                        {systemHealth?.systemMetrics?.memoryUsage || 0 > 50 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </span>
                    </div>
                    <Progress value={systemHealth?.systemMetrics?.memoryUsage || 0} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Disk Usage */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">
                        {systemHealth?.systemMetrics?.diskUsage || 0}%
                      </span>
                      <span className={getUsageColor(systemHealth?.systemMetrics?.diskUsage || 0)}>
                        {systemHealth?.systemMetrics?.diskUsage || 0 > 50 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </span>
                    </div>
                    <Progress value={systemHealth?.systemMetrics?.diskUsage || 0} className="w-full" />
                  </div>
                </CardContent>
              </Card>

              {/* Active Connections */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {systemHealth?.systemMetrics?.activeConnections?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current active connections
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance History</CardTitle>
                <CardDescription>Response time and request volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={systemHealth?.performanceHistory || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.3}
                      name="Response Time (ms)"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="requests" 
                      stroke="#06B6D4" 
                      name="Requests"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate Trend</CardTitle>
                <CardDescription>Error rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={systemHealth?.performanceHistory || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="errors" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      name="Errors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system events and errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {systemLogs?.slice(0, 50).map((log: ServiceLog) => (
                    <div key={log.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getLogLevelColor(log.level)}>
                            {log.level.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{log.service}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(log.timestamp))} ago
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.message}</p>
                      {log.metadata && (
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 mt-2 rounded overflow-x-auto">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-8">No recent logs available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}