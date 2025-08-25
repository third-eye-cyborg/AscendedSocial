import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Flag,
  User,
  FileText
} from "lucide-react";
import type { Report } from "@shared/schema";

export default function AdminReportsPage() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingReports = [], isLoading } = useQuery({
    queryKey: ["/api/reports", "pending"],
    queryFn: () => apiRequest("GET", "/api/reports/pending"),
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: string; status: "resolved" | "dismissed" }) => {
      return apiRequest("PUT", `/api/reports/${reportId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Report Updated",
        description: "The report status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update report status.",
        variant: "destructive",
      });
    },
  });

  const getReportIcon = (type: string) => {
    const icons = {
      spam: "🚫",
      harassment: "⚠️",
      inappropriate_content: "🔞",
      hate_speech: "💢",
      violence: "⚡",
      misinformation: "❓",
      copyright_violation: "©️",
      fake_profile: "🎭",
      other: "📋",
    };
    return icons[type as keyof typeof icons] || "📋";
  };

  const getReportTypeLabel = (type: string) => {
    return type
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "resolved": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "dismissed": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default: return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-dark p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Shield className="w-8 h-8 mr-3 text-primary" />
            Community Reports
          </h1>
          <p className="text-white/70 mt-2">
            Review and manage user reports to maintain community standards
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-cosmic-light border-primary/30">
            <TabsTrigger value="pending" className="text-white data-[state=active]:bg-primary">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Pending ({pendingReports.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="text-white data-[state=active]:bg-primary">
              <Eye className="w-4 h-4 mr-2" />
              All Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-white">Loading reports...</span>
              </div>
            ) : pendingReports.length === 0 ? (
              <Card className="bg-cosmic-light border-primary/30">
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">All Clear!</h3>
                  <p className="text-white/70">No pending reports at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingReports.map((report: Report & { reporter?: any; reportedUser?: any; post?: any }) => (
                  <Card key={report.id} className="bg-cosmic-light border-primary/30">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{getReportIcon(report.type)}</div>
                          <div>
                            <CardTitle className="text-white flex items-center">
                              {getReportTypeLabel(report.type)}
                              {report.postId && <FileText className="w-4 h-4 ml-2 text-blue-400" />}
                              {report.reportedUserId && <User className="w-4 h-4 ml-2 text-purple-400" />}
                            </CardTitle>
                            <CardDescription className="text-white/70">
                              Reported {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(report.status)} border`}>
                          {report.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {/* Reporter Information */}
                        <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/20">
                          <h4 className="text-sm font-medium text-blue-300 mb-1">Reporter</h4>
                          <p className="text-white text-sm">
                            {report.reporter?.username || report.reporter?.email || "Unknown User"}
                          </p>
                        </div>

                        {/* Target Information */}
                        {report.postId && (
                          <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
                            <h4 className="text-sm font-medium text-purple-300 mb-1">Reported Post</h4>
                            <p className="text-white text-sm">
                              Post ID: {report.postId}
                            </p>
                            {report.post?.content && (
                              <p className="text-white/70 text-sm mt-1 truncate">
                                "{report.post.content.substring(0, 100)}..."
                              </p>
                            )}
                          </div>
                        )}

                        {report.reportedUserId && (
                          <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/20">
                            <h4 className="text-sm font-medium text-red-300 mb-1">Reported User</h4>
                            <p className="text-white text-sm">
                              {report.reportedUser?.username || report.reportedUser?.email || "Unknown User"}
                            </p>
                          </div>
                        )}

                        {/* Report Reason */}
                        {report.reason && (
                          <div className="bg-cosmic-dark rounded-lg p-3 border border-primary/20">
                            <h4 className="text-sm font-medium text-primary mb-1">Additional Details</h4>
                            <p className="text-white/80 text-sm">{report.reason}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-3 pt-4 border-t border-primary/20">
                          <Button
                            onClick={() => updateReportMutation.mutate({ reportId: report.id, status: "resolved" })}
                            disabled={updateReportMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                            data-testid={`button-resolve-${report.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Resolve
                          </Button>
                          <Button
                            onClick={() => updateReportMutation.mutate({ reportId: report.id, status: "dismissed" })}
                            disabled={updateReportMutation.isPending}
                            variant="outline"
                            className="border-red-500/50 text-red-300 hover:bg-red-500/10 flex items-center"
                            data-testid={`button-dismiss-${report.id}`}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <Card className="bg-cosmic-light border-primary/30">
              <CardContent className="text-center py-12">
                <Flag className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">All Reports View</h3>
                <p className="text-white/70">This would show all reports with filtering options.</p>
                <p className="text-white/50 text-sm mt-2">Feature coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}