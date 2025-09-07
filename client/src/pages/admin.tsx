import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, TrendingUp, AlertTriangle, Shield, Activity, Eye, Ban, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface UserAnalytics {
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

interface UserReport {
  id: string;
  type: string;
  reason: string;
  status: string;
  postId?: string;
  reportedUserId?: string;
  reporter: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  reportedUser?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  post?: {
    id: string;
    content: string;
    author: {
      email: string;
      firstName: string;
      lastName: string;
    };
  };
  createdAt: string;
  updatedAt: string;
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

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery<UserAnalytics>({
    queryKey: ['/api/admin/analytics', selectedPeriod],
    queryFn: () => apiRequest(`/api/admin/analytics?period=${selectedPeriod}`),
  });

  // Fetch user reports
  const { data: reports, isLoading: reportsLoading } = useQuery<UserReport[]>({
    queryKey: ['/api/admin/reports'],
    queryFn: () => apiRequest('/api/admin/reports'),
  });

  // Fetch system health
  const { data: systemHealth, isLoading: healthLoading } = useQuery<SystemHealth>({
    queryKey: ['/api/admin/health'],
    queryFn: () => apiRequest('/api/admin/health'),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Mutation to update report status
  const updateReportMutation = useMutation({
    mutationFn: ({ reportId, status, notes }: { reportId: string; status: string; notes?: string }) =>
      apiRequest(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status, moderatorNotes: notes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      toast({ title: "Report updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update report", variant: "destructive" });
    },
  });

  const handleUpdateReport = (reportId: string, status: string, notes?: string) => {
    updateReportMutation.mutate({ reportId, status, notes });
  };

  const getReportTypeColor = (type: string) => {
    const colors = {
      spam: "bg-yellow-100 text-yellow-800",
      harassment: "bg-red-100 text-red-800",
      inappropriate_content: "bg-orange-100 text-orange-800",
      hate_speech: "bg-red-100 text-red-800",
      violence: "bg-red-100 text-red-800",
      misinformation: "bg-purple-100 text-purple-800",
      copyright_violation: "bg-blue-100 text-blue-800",
      fake_profile: "bg-gray-100 text-gray-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      dismissed: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (analyticsLoading || reportsLoading || healthLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200">Admin Dashboard</h1>
          <Shield className="h-8 w-8 text-purple-600" />
        </div>
        <div className="text-center py-8">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="admin-dashboard">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-200">Admin Dashboard</h1>
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
          <Shield className="h-8 w-8 text-purple-600" />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports" data-testid="tab-reports">
            Reports
            {reports && reports.filter(r => r.status === 'pending').length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {reports.filter(r => r.status === 'pending').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="health" data-testid="tab-health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-total-users">
                  {analytics?.totalUsers.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{analytics?.newUsersWeek || 0} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-premium-users">
                  {analytics?.premiumUsers.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalUsers 
                    ? ((analytics.premiumUsers / analytics.totalUsers) * 100).toFixed(1)
                    : 0}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-total-posts">
                  {analytics?.totalPosts.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalEngagements.toLocaleString() || 0} engagements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600" data-testid="metric-pending-reports">
                  {reports?.filter(r => r.status === 'pending').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requires attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest user actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.recentActivity?.slice(0, 10).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <div>
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.userEmail} • {formatDistanceToNow(new Date(activity.timestamp))} ago
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Chakra Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chakra Distribution</CardTitle>
                <CardDescription>Post categorization by spiritual chakras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.chakraDistribution?.map((chakra) => (
                    <div key={chakra.chakra} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${chakra.chakra === 'root' ? 'red' : chakra.chakra === 'sacral' ? 'orange' : chakra.chakra === 'solar' ? 'yellow' : chakra.chakra === 'heart' ? 'green' : chakra.chakra === 'throat' ? 'blue' : chakra.chakra === 'third_eye' ? 'indigo' : 'purple'}-500`} />
                        <span className="capitalize font-medium">{chakra.chakra.replace('_', ' ')}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{chakra.count}</span>
                        <span className="text-muted-foreground ml-2">({chakra.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Types</CardTitle>
                <CardDescription>How users interact with content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.engagementTypes?.map((engagement) => (
                    <div key={engagement.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="capitalize font-medium">{engagement.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold">{engagement.count}</span>
                        <span className="text-muted-foreground ml-2">({engagement.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  )) || []}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Oracle Readings */}
          <Card>
            <CardHeader>
              <CardTitle>Oracle Readings</CardTitle>
              <CardDescription>AI-powered spiritual guidance usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {analytics?.totalOracleReadings.toLocaleString() || 0}
              </div>
              <p className="text-muted-foreground">Total readings generated</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>Content moderation and user safety reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports?.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Badge className={getReportTypeColor(report.type)}>
                          {report.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {report.reporter.firstName} {report.reporter.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {report.reporter.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {report.post ? (
                          <div>
                            <p className="font-medium">Post by {report.post.author.firstName} {report.post.author.lastName}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-32">
                              {report.post.content}
                            </p>
                          </div>
                        ) : report.reportedUser ? (
                          <div>
                            <p className="font-medium">
                              {report.reportedUser.firstName} {report.reportedUser.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {report.reportedUser.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-48 truncate" title={report.reason}>
                          {report.reason}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {formatDistanceToNow(new Date(report.createdAt))} ago
                        </p>
                      </TableCell>
                      <TableCell>
                        {report.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateReport(report.id, 'reviewed')}
                              data-testid={`button-review-${report.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleUpdateReport(report.id, 'resolved')}
                              data-testid={`button-resolve-${report.id}`}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleUpdateReport(report.id, 'dismissed')}
                              data-testid={`button-dismiss-${report.id}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )) || []}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemHealth?.activeServices || 0} / {systemHealth?.totalServices || 0}
                </div>
                <p className="text-muted-foreground">Services Online</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemHealth?.averageResponseTime || 0}ms
                </div>
                <p className="text-muted-foreground">Average Response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemHealth?.errorRate?.toFixed(2) || 0}%
                </div>
                <p className="text-muted-foreground">Error Rate</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Last Check</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemHealth?.serviceStatus?.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            service.status === 'healthy' 
                              ? 'bg-green-100 text-green-800'
                              : service.status === 'degraded'
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {service.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{service.responseTime}ms</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(service.lastCheck))} ago
                      </TableCell>
                    </TableRow>
                  )) || []}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}