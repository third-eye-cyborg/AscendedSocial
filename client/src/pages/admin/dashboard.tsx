import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Eye,
  Calendar,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import AdminLayout from "@/components/admin/AdminLayout";

interface DashboardAnalytics {
  totalUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  premiumUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalEngagements: number;
  totalOracleReadings: number;
  chakraDistribution: { chakra: string; count: number; percentage: number }[];
  engagementTypes: { type: string; count: number; percentage: number }[];
  dailySignups: { date: string; count: number }[];
  recentActivity: {
    type: string;
    description: string;
    timestamp: string;
    userId: string;
    userEmail: string;
  }[];
}

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
}

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<DashboardAnalytics>({
    queryKey: ['/api/admin/analytics', selectedPeriod],
  });

  // Fetch system health
  const { data: systemHealth, isLoading: healthLoading } = useQuery<SystemHealth>({
    queryKey: ['/api/admin/health'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch reports count for pending badge
  const { data: reports } = useQuery<Array<{ id: string; status: string }>>({
    queryKey: ['/api/admin/reports'],
  });

  const pendingReports = reports?.filter((r: { status: string }) => r.status === 'pending')?.length || 0;

  if (analyticsLoading || healthLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const healthyServices = systemHealth?.serviceStatus?.filter((s: { status: string }) => s.status === 'healthy').length || 0;
  const totalServices = systemHealth?.serviceStatus?.length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="admin-dashboard">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Overview of Ascended Social platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Today</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-total-users">
                {analytics?.totalUsers?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{analytics?.newUsersWeek || 0} this week
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-active-users">
                {analytics?.activeUsers?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active in last {selectedPeriod}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-total-posts">
                {analytics?.totalPosts?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics?.totalEngagements || 0} total engagements
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="metric-pending-reports">
                {pendingReports}
              </div>
              <p className="text-xs text-muted-foreground">
                Requires moderation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Health Alert */}
        {systemHealth && (
          <Card className={`border-l-4 ${
            healthyServices === totalServices ? 'border-l-green-500' : 
            healthyServices > totalServices * 0.7 ? 'border-l-yellow-500' : 'border-l-red-500'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <div className="flex items-center space-x-2">
                {healthyServices === totalServices ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {healthyServices}/{totalServices}
              </div>
              <p className="text-xs text-muted-foreground">
                Services operational • Avg response: {systemHealth.averageResponseTime}ms
              </p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="chakras" data-testid="tab-chakras">Chakra Distribution</TabsTrigger>
            <TabsTrigger value="engagement" data-testid="tab-engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Signups Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Signups</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.dailySignups || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Premium vs Free Users */}
              <Card>
                <CardHeader>
                  <CardTitle>User Types</CardTitle>
                  <CardDescription>Premium vs free user distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Premium Users</span>
                      <Badge variant="secondary">{analytics?.premiumUsers || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Free Users</span>
                      <Badge variant="outline">
                        {(analytics?.totalUsers || 0) - (analytics?.premiumUsers || 0)}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ 
                          width: `${((analytics?.premiumUsers || 0) / (analytics?.totalUsers || 1)) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.recentActivity?.slice(0, 10).map((activity: { type: string; description: string; timestamp: string; userId: string; userEmail: string }, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.userEmail} • {formatDistanceToNow(new Date(activity.timestamp))} ago
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-8">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chakras" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chakra Distribution</CardTitle>
                <CardDescription>Content categorization by chakra energy</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics?.chakraDistribution || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ chakra, percentage }: { chakra: string; percentage: number }) => `${chakra} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(analytics?.chakraDistribution || []).map((entry: { chakra: string; count: number; percentage: number }, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Types</CardTitle>
                <CardDescription>How users interact with content</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics?.engagementTypes || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}