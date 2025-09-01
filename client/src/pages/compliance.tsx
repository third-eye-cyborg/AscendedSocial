import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Compliance() {
  const [automationUrl, setAutomationUrl] = useState("http://localhost:5000");
  const [automationInstructions, setAutomationInstructions] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("sparks");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Privacy compliance scan
  const privacyScanMutation = useMutation({
    mutationFn: () => fetch('/api/compliance/privacy').then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "Privacy Scan Complete",
        description: `Compliance Score: ${data.privacy.summary.complianceScore}/100`,
      });
    },
    onError: () => {
      toast({
        title: "Privacy Scan Failed",
        description: "Could not complete privacy compliance scan.",
        variant: "destructive",
      });
    },
  });

  // Security scan
  const securityScanMutation = useMutation({
    mutationFn: () => fetch('/api/compliance/security').then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "Security Scan Complete",
        description: `Security Score: ${data.security.securityScore}/100`,
      });
    },
    onError: () => {
      toast({
        title: "Security Scan Failed",
        description: "Could not complete security vulnerability scan.",
        variant: "destructive",
      });
    },
  });

  // Browser automation
  const automationMutation = useMutation({
    mutationFn: ({ instructions, url }: { instructions: string; url: string }) =>
      fetch('/api/automation/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructions, url }),
      }).then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "Automation Complete",
        description: data.success ? "Task executed successfully" : "Task failed",
        variant: data.success ? "default" : "destructive",
      });
    },
  });

  // Feature testing
  const featureTestMutation = useMutation({
    mutationFn: (feature: string) =>
      fetch(`/api/automation/test/${feature}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl: automationUrl }),
      }).then(res => res.json()),
    onSuccess: (data) => {
      toast({
        title: "Feature Test Complete",
        description: data.success ? "All tests passed" : "Some tests failed",
        variant: data.success ? "default" : "destructive",
      });
    },
  });

  // Platform monitoring
  const { data: monitoringData, refetch: refetchMonitoring } = useQuery({
    queryKey: ['/api/automation/monitor'],
    queryFn: () => fetch('/api/automation/monitor').then(res => res.json()),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Compliance report
  const generateReportMutation = useMutation({
    mutationFn: (format: 'json' | 'html') =>
      fetch(`/api/compliance/report?format=${format}`).then(res => 
        format === 'html' ? res.text() : res.json()
      ),
    onSuccess: (data, format) => {
      if (format === 'html') {
        // Open report in new window
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(data);
          newWindow.document.close();
        }
      } else {
        // Download JSON report
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
      
      toast({
        title: "Report Generated",
        description: `Compliance report generated in ${format.toUpperCase()} format`,
      });
    },
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🛡️ Compliance & Automation Dashboard</h1>
          <p className="text-gray-400">
            Privacy compliance scanning, security analysis, and browser automation for Ascended Social
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Privacy Compliance */}
          <Card className="bg-cosmic-light border border-primary/30">
            <CardHeader>
              <CardTitle className="text-accent-light flex items-center">
                <i className="fas fa-shield-alt mr-2"></i>
                Privacy Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                Scan codebase for GDPR, CCPA, and privacy compliance issues. Identifies data flows, 
                consent mechanisms, and potential violations.
              </p>
              
              <div className="space-y-2">
                <Button
                  onClick={() => privacyScanMutation.mutate()}
                  disabled={privacyScanMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  data-testid="button-privacy-scan"
                >
                  {privacyScanMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-search mr-2"></i>
                      Run Privacy Scan
                    </>
                  )}
                </Button>
              </div>

              {privacyScanMutation.data && (
                <div className="mt-4 p-3 bg-cosmic rounded border border-primary/20">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Compliance Score:</span>
                      <span className="font-semibold text-primary">
                        {privacyScanMutation.data.privacy.summary.complianceScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Flows:</span>
                      <span>{privacyScanMutation.data.privacy.summary.totalDataFlows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Risk:</span>
                      <span className="text-red-400">
                        {privacyScanMutation.data.privacy.summary.highRiskFlows}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Violations:</span>
                      <span className="text-yellow-400">
                        {privacyScanMutation.data.privacy.summary.violations}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Analysis */}
          <Card className="bg-cosmic-light border border-primary/30">
            <CardHeader>
              <CardTitle className="text-accent-light flex items-center">
                <i className="fas fa-lock mr-2"></i>
                Security Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">
                Scan for security vulnerabilities including SQL injection, XSS, authentication 
                issues, and insecure configurations.
              </p>
              
              <Button
                onClick={() => securityScanMutation.mutate()}
                disabled={securityScanMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700"
                data-testid="button-security-scan"
              >
                {securityScanMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Scanning...
                  </>
                ) : (
                  <>
                    <i className="fas fa-bug mr-2"></i>
                    Run Security Scan
                  </>
                )}
              </Button>

              {securityScanMutation.data && (
                <div className="mt-4 p-3 bg-cosmic rounded border border-primary/20">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Security Score:</span>
                      <span className="font-semibold text-primary">
                        {securityScanMutation.data.security.securityScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vulnerabilities:</span>
                      <span className="text-red-400">
                        {securityScanMutation.data.security.vulnerabilities.length}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Auth: {securityScanMutation.data.security.categories.authentication}/100 | 
                      Data: {securityScanMutation.data.security.categories.dataProtection}/100 | 
                      Input: {securityScanMutation.data.security.categories.inputValidation}/100
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Browser Automation */}
        <Card className="bg-cosmic-light border border-primary/30 mb-8">
          <CardHeader>
            <CardTitle className="text-accent-light flex items-center">
              <i className="fas fa-robot mr-2"></i>
              Browser Automation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Execute natural language browser automation tasks for testing and monitoring.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                <Input
                  value={automationUrl}
                  onChange={(e) => setAutomationUrl(e.target.value)}
                  placeholder="http://localhost:5000"
                  className="bg-cosmic border-primary/30 text-white"
                  data-testid="input-automation-url"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Feature Test</label>
                <select
                  value={selectedFeature}
                  onChange={(e) => setSelectedFeature(e.target.value)}
                  className="w-full p-2 bg-cosmic border border-primary/30 rounded text-white"
                  data-testid="select-feature"
                >
                  <option value="sparks">Sparks (Video Posts)</option>
                  <option value="posts">Main Feed</option>
                  <option value="oracle">Oracle Readings</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Automation Instructions
              </label>
              <Textarea
                value={automationInstructions}
                onChange={(e) => setAutomationInstructions(e.target.value)}
                placeholder="Click the sparks button. Type 'Test spiritual insight'. Click create spark button."
                className="bg-cosmic border-primary/30 text-white min-h-[80px]"
                data-testid="textarea-instructions"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => automationMutation.mutate({ 
                  instructions: automationInstructions, 
                  url: automationUrl 
                })}
                disabled={!automationInstructions.trim() || automationMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
                data-testid="button-execute-automation"
              >
                {automationMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Executing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play mr-2"></i>
                    Execute Automation
                  </>
                )}
              </Button>

              <Button
                onClick={() => featureTestMutation.mutate(selectedFeature)}
                disabled={featureTestMutation.isPending}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
                data-testid="button-test-feature"
              >
                {featureTestMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Testing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-vial mr-2"></i>
                    Test {selectedFeature}
                  </>
                )}
              </Button>
            </div>

            {automationMutation.data && (
              <div className="mt-4 p-3 bg-cosmic rounded border border-primary/20">
                <div className="text-sm">
                  <div className="flex items-center mb-2">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      automationMutation.data.results.success ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    <span className="font-semibold">
                      {automationMutation.data.results.success ? 'Success' : 'Failed'}
                    </span>
                  </div>
                  {automationMutation.data.results.screenshots && (
                    <div className="text-xs text-gray-400">
                      Screenshots captured: {automationMutation.data.results.screenshots.length}
                    </div>
                  )}
                  {automationMutation.data.results.error && (
                    <div className="text-red-400 text-xs mt-1">
                      {automationMutation.data.results.error}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Monitoring */}
        <Card className="bg-cosmic-light border border-primary/30 mb-8">
          <CardHeader>
            <CardTitle className="text-accent-light flex items-center">
              <i className="fas fa-chart-line mr-2"></i>
              Platform Monitoring
              <Button
                onClick={() => refetchMonitoring()}
                size="sm"
                variant="outline"
                className="ml-auto border-primary/30 text-primary hover:bg-primary/10"
                data-testid="button-refresh-monitoring"
              >
                <i className="fas fa-sync mr-1"></i>
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monitoringData?.monitoring && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    monitoringData.monitoring.status === 'healthy' ? 'text-green-400' : 
                    monitoringData.monitoring.status === 'degraded' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {monitoringData.monitoring.status.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-400">System Status</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {monitoringData.monitoring.spiritualMetrics.energyFlows}
                  </div>
                  <div className="text-xs text-gray-400">Energy Flows</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {monitoringData.monitoring.spiritualMetrics.oracleReadings}
                  </div>
                  <div className="text-xs text-gray-400">Oracle Readings</div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {monitoringData.monitoring.spiritualMetrics.activeMeditations}
                  </div>
                  <div className="text-xs text-gray-400">Active Meditations</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compliance Reports */}
        <Card className="bg-cosmic-light border border-primary/30">
          <CardHeader>
            <CardTitle className="text-accent-light flex items-center">
              <i className="fas fa-file-alt mr-2"></i>
              Compliance Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300 text-sm">
              Generate comprehensive compliance reports combining privacy and security analysis.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => generateReportMutation.mutate('json')}
                disabled={generateReportMutation.isPending}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
                data-testid="button-json-report"
              >
                <i className="fas fa-download mr-2"></i>
                Download JSON
              </Button>

              <Button
                onClick={() => generateReportMutation.mutate('html')}
                disabled={generateReportMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-html-report"
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                View HTML Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}