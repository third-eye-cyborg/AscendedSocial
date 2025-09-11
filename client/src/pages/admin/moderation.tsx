import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Flag, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
  Filter
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";

interface Report {
  id: string;
  type: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
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
  moderatorNotes?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface BulkAction {
  reportIds: string[];
  action: 'approve' | 'dismiss' | 'remove';
  notes?: string;
}

export default function ContentModeration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filterStatus, setFilterStatus] = useState("pending");
  const [filterType, setFilterType] = useState("all");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [moderatorNotes, setModeratorNotes] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Fetch reports
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['/api/admin/reports'],
  });

  // Update report mutation
  const updateReportMutation = useMutation({
    mutationFn: ({ reportId, status, notes }: { reportId: string; status: string; notes?: string }) =>
      apiRequest(`/api/admin/reports/${reportId}`, 'PATCH', { status, moderatorNotes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      toast({ title: "Report updated successfully" });
      setModeratorNotes("");
      setSelectedReport(null);
    },
    onError: () => {
      toast({ title: "Failed to update report", variant: "destructive" });
    },
  });

  // Bulk action mutation
  const bulkActionMutation = useMutation({
    mutationFn: (action: BulkAction) =>
      apiRequest('/api/admin/reports/bulk', 'POST', action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
      toast({ title: "Bulk action completed successfully" });
      setSelectedReports([]);
      setModeratorNotes("");
    },
    onError: () => {
      toast({ title: "Failed to perform bulk action", variant: "destructive" });
    },
  });

  const handleUpdateReport = (reportId: string, status: string, notes?: string) => {
    updateReportMutation.mutate({ reportId, status, notes });
  };

  const handleBulkAction = (action: 'approve' | 'dismiss' | 'remove') => {
    if (selectedReports.length === 0) {
      toast({ title: "Please select reports to perform bulk action", variant: "destructive" });
      return;
    }

    bulkActionMutation.mutate({
      reportIds: selectedReports,
      action,
      notes: moderatorNotes
    });
  };

  const getReportTypeColor = (type: string) => {
    const colors = {
      spam: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      harassment: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      inappropriate_content: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      hate_speech: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      violence: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      misinformation: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      copyright_violation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      fake_profile: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      reviewed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      dismissed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const filteredReports = (reports || []).filter((report: Report) => {
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    const matchesType = filterType === "all" || report.type === filterType;
    return matchesStatus && matchesType;
  });

  const pendingCount = (reports || []).filter((r: Report) => r.status === 'pending').length;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Moderation</h1>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading reports...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="content-moderation">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Moderation</h1>
            <p className="text-gray-600 dark:text-gray-400">Review and moderate reported content</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {pendingCount} pending
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(reports || []).filter((r: Report) => r.status === 'resolved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dismissed</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(reports || []).filter((r: Report) => r.status === 'dismissed').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(reports || []).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Bulk Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Moderation Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="dismissed">Dismissed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                    <SelectItem value="harassment">Harassment</SelectItem>
                    <SelectItem value="inappropriate_content">Inappropriate</SelectItem>
                    <SelectItem value="hate_speech">Hate Speech</SelectItem>
                    <SelectItem value="violence">Violence</SelectItem>
                    <SelectItem value="misinformation">Misinformation</SelectItem>
                    <SelectItem value="copyright_violation">Copyright</SelectItem>
                    <SelectItem value="fake_profile">Fake Profile</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedReports.length > 0 && (
                <div className="flex gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('approve')}
                    disabled={bulkActionMutation.isPending}
                  >
                    Approve Selected ({selectedReports.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('dismiss')}
                    disabled={bulkActionMutation.isPending}
                  >
                    Dismiss Selected
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction('remove')}
                    disabled={bulkActionMutation.isPending}
                  >
                    Remove Content
                  </Button>
                </div>
              )}
            </div>

            {selectedReports.length > 0 && (
              <div className="mb-4">
                <Textarea
                  placeholder="Moderation notes (optional)"
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  className="max-w-md"
                />
              </div>
            )}

            {/* Reports Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedReports(filteredReports.map((r: Report) => r.id));
                          } else {
                            setSelectedReports([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Report</TableHead>
                    <TableHead>Content/User</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report: Report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedReports.includes(report.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedReports([...selectedReports, report.id]);
                            } else {
                              setSelectedReports(selectedReports.filter(id => id !== report.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getReportTypeColor(report.type)}>
                            {report.type.replace('_', ' ')}
                          </Badge>
                          <p className="text-sm text-muted-foreground max-w-xs truncate">
                            {report.reason}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {report.post ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-sm font-medium">Post</span>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-xs truncate">
                              {report.post.content}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              by {report.post.author.firstName} {report.post.author.lastName}
                            </p>
                          </div>
                        ) : report.reportedUser ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="text-sm font-medium">User</span>
                            </div>
                            <p className="text-sm">
                              {report.reportedUser.firstName} {report.reportedUser.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {report.reportedUser.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unknown</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {report.reporter.firstName[0]}{report.reporter.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {report.reporter.firstName} {report.reporter.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {report.reporter.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(report.createdAt))} ago
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Report Details</DialogTitle>
                                <DialogDescription>
                                  Review and moderate this report
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Type</label>
                                    <Badge className={getReportTypeColor(report.type)}>
                                      {report.type.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <Badge className={getStatusColor(report.status)}>
                                      {report.status}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium">Reason</label>
                                  <p className="text-sm text-muted-foreground mt-1">{report.reason}</p>
                                </div>

                                {report.post && (
                                  <div>
                                    <label className="text-sm font-medium">Reported Content</label>
                                    <div className="mt-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                      <p className="text-sm">{report.post.content}</p>
                                      <p className="text-xs text-muted-foreground mt-2">
                                        by {report.post.author.firstName} {report.post.author.lastName}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Textarea
                                    placeholder="Moderation notes"
                                    value={moderatorNotes}
                                    onChange={(e) => setModeratorNotes(e.target.value)}
                                  />
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleUpdateReport(report.id, 'resolved', moderatorNotes)}
                                      disabled={updateReportMutation.isPending}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Resolve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => handleUpdateReport(report.id, 'dismissed', moderatorNotes)}
                                      disabled={updateReportMutation.isPending}
                                    >
                                      Dismiss
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleUpdateReport(report.id, 'resolved', moderatorNotes)}
                                      disabled={updateReportMutation.isPending}
                                    >
                                      Remove Content
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}