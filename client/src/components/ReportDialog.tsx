import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Flag, AlertTriangle, Shield } from "lucide-react";
import type { ReportType } from "@shared/schema";

interface ReportDialogProps {
  children?: React.ReactNode;
  postId?: string;
  reportedUserId?: string;
  reportedUsername?: string;
  trigger?: React.ReactNode;
}

const reportTypeOptions: { value: ReportType; label: string; description: string }[] = [
  { value: "spam", label: "Spam", description: "Unwanted repetitive or commercial content" },
  { value: "harassment", label: "Harassment", description: "Bullying, threatening, or intimidating behavior" },
  { value: "inappropriate_content", label: "Inappropriate Content", description: "Sexual, violent, or offensive material" },
  { value: "hate_speech", label: "Hate Speech", description: "Content targeting individuals or groups with hostility" },
  { value: "violence", label: "Violence", description: "Threats or promotion of physical harm" },
  { value: "misinformation", label: "Misinformation", description: "False or misleading information" },
  { value: "copyright_violation", label: "Copyright Violation", description: "Unauthorized use of copyrighted material" },
  { value: "fake_profile", label: "Fake Profile", description: "Impersonation or fake account" },
  { value: "other", label: "Other", description: "Other violation not listed above" },
];

export default function ReportDialog({ 
  children, 
  postId, 
  reportedUserId, 
  reportedUsername,
  trigger 
}: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ReportType | "">("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reportMutation = useMutation({
    mutationFn: async (data: { type: ReportType; reason?: string; postId?: string; reportedUserId?: string }) => {
      return apiRequest("POST", "/api/reports", data);
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Thank you for helping keep our community safe. Your report has been received and will be reviewed.",
      });
      setOpen(false);
      setType("");
      setReason("");
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
    },
    onError: (error: any) => {
      toast({
        title: "Report Failed",
        description: error?.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type) {
      toast({
        title: "Missing Information",
        description: "Please select a report reason.",
        variant: "destructive",
      });
      return;
    }

    reportMutation.mutate({
      type: type as ReportType,
      reason: reason.trim() || undefined,
      postId,
      reportedUserId,
    });
  };

  const isReportingUser = !!reportedUserId;
  const reportTarget = isReportingUser ? `@${reportedUsername || "this user"}` : "this post";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
            data-testid="button-report"
          >
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-cosmic-dark border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-primary" />
            Report {reportTarget}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Help us maintain a safe and respectful community by reporting content that violates our guidelines.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="report-type" className="text-white">
              What type of issue are you reporting?
            </Label>
            <Select value={type} onValueChange={(value: ReportType) => setType(value)}>
              <SelectTrigger className="bg-cosmic-light border-primary/30 text-white" data-testid="select-report-type">
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent className="bg-cosmic-dark border-primary/30">
                {reportTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-primary/10">
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-white/60">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason" className="text-white">
              Additional details (optional)
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide any additional context that might help our moderation team..."
              className="bg-cosmic-light border-primary/30 text-white placeholder:text-white/40 mt-2"
              rows={3}
              maxLength={500}
              data-testid="textarea-report-reason"
            />
            <div className="text-xs text-white/50 mt-1">
              {reason.length}/500 characters
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
              <div className="text-xs text-amber-200">
                <p className="font-medium mb-1">Important:</p>
                <p>False or malicious reports may result in action against your account. Please only report content that genuinely violates our community guidelines.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white"
              data-testid="button-cancel-report"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!type || reportMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-submit-report"
            >
              {reportMutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}