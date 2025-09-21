import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ConsentPreferences {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean;
}

interface DataSubjectRequest {
  email: string;
  requestType: 'access' | 'delete' | 'rectify' | 'portability' | 'restrict' | 'object';
  description?: string;
  verificationMethod: 'email' | 'identity_document' | 'account_access';
}

export default function PrivacyManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [consentPrefs, setConsentPrefs] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });

  const [dsarForm, setDsarForm] = useState<DataSubjectRequest>({
    email: '',
    requestType: 'access',
    description: '',
    verificationMethod: 'email'
  });

  // Submit consent preferences
  const consentMutation = useMutation({
    mutationFn: (preferences: Partial<ConsentPreferences>) =>
      apiRequest('/api/privacy/consent', {
        method: 'POST',
        body: JSON.stringify({ purposes: preferences })
      }),
    onSuccess: () => {
      toast({
        title: "Consent Updated",
        description: "Your privacy preferences have been saved successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update consent preferences.",
        variant: "destructive"
      });
    }
  });

  // Submit DSAR
  const dsarMutation = useMutation({
    mutationFn: (request: DataSubjectRequest) =>
      apiRequest('/api/privacy/dsar', {
        method: 'POST',
        body: JSON.stringify(request)
      }),
    onSuccess: (data: any) => {
      toast({
        title: "Request Submitted",
        description: `Your ${dsarForm.requestType} request has been submitted. Request ID: ${data.requestId}`
      });
      setDsarForm({
        email: '',
        requestType: 'access',
        description: '',
        verificationMethod: 'email'
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit data request.",
        variant: "destructive"
      });
    }
  });

  // Submit Do Not Sell request
  const doNotSellMutation = useMutation({
    mutationFn: (email: string) =>
      apiRequest('/api/privacy/do-not-sell', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    onSuccess: () => {
      toast({
        title: "Request Processed",
        description: "Your Do Not Sell request has been processed successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process Do Not Sell request.",
        variant: "destructive"
      });
    }
  });

  const handleConsentChange = (key: keyof ConsentPreferences, value: boolean) => {
    const updated = { ...consentPrefs, [key]: value };
    setConsentPrefs(updated);
    consentMutation.mutate({ [key]: value });
  };

  const handleDsarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dsarMutation.mutate(dsarForm);
  };

  const handleDoNotSell = () => {
    if (!dsarForm.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    doNotSellMutation.mutate(dsarForm.email);
  };

  return (
    <div className="min-h-screen bg-cosmic text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cosmic/80 backdrop-blur-2xl border-b border-primary/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md animate-pulse"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <i className="fas fa-shield-alt text-white text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Privacy Management
                </h1>
                <p className="text-xs text-muted font-medium tracking-wide hidden sm:block">DATA RIGHTS • CONSENT • COMPLIANCE</p>
              </div>
            </div>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="bg-gradient-to-r from-primary to-secondary text-white border-none"
              data-testid="button-home"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 mt-8">
            <h2 className="text-4xl sm:text-5xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-chakra-heart to-secondary bg-clip-text text-transparent">
                Your Privacy Rights
              </span>
            </h2>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Manage your data privacy preferences and exercise your rights under GDPR, CCPA, and other privacy regulations.
            </p>
          </div>

          <Tabs defaultValue="consent" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-cosmic/50 border border-primary/20">
              <TabsTrigger value="consent" data-testid="tab-consent">Consent Preferences</TabsTrigger>
              <TabsTrigger value="requests" data-testid="tab-requests">Data Requests</TabsTrigger>
              <TabsTrigger value="ccpa" data-testid="tab-ccpa">CCPA Rights</TabsTrigger>
            </TabsList>

            <TabsContent value="consent" className="space-y-6">
              <Card className="bg-cosmic/50 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Cookie & Data Consent</CardTitle>
                  <CardDescription className="text-white/70">
                    Control how we use your data and manage your cookie preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white font-medium">Essential Cookies</Label>
                      <p className="text-sm text-white/60">Required for basic website functionality</p>
                    </div>
                    <Switch checked={true} disabled />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white font-medium">Analytics</Label>
                      <p className="text-sm text-white/60">Help us understand how you use our website</p>
                    </div>
                    <Switch 
                      checked={consentPrefs.analytics}
                      onCheckedChange={(checked) => handleConsentChange('analytics', checked)}
                      data-testid="switch-analytics"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white font-medium">Marketing</Label>
                      <p className="text-sm text-white/60">Personalized ads and promotional content</p>
                    </div>
                    <Switch 
                      checked={consentPrefs.marketing}
                      onCheckedChange={(checked) => handleConsentChange('marketing', checked)}
                      data-testid="switch-marketing"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-white font-medium">Functional</Label>
                      <p className="text-sm text-white/60">Enhanced features and personalization</p>
                    </div>
                    <Switch 
                      checked={consentPrefs.functional}
                      onCheckedChange={(checked) => handleConsentChange('functional', checked)}
                      data-testid="switch-functional"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <Card className="bg-cosmic/50 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">Data Subject Access Requests</CardTitle>
                  <CardDescription className="text-white/70">
                    Request access, deletion, or modification of your personal data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDsarSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={dsarForm.email}
                        onChange={(e) => setDsarForm({...dsarForm, email: e.target.value})}
                        required
                        className="bg-cosmic border-primary/20 text-white"
                        data-testid="input-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requestType">Request Type</Label>
                      <Select 
                        value={dsarForm.requestType} 
                        onValueChange={(value: any) => setDsarForm({...dsarForm, requestType: value})}
                      >
                        <SelectTrigger className="bg-cosmic border-primary/20 text-white" data-testid="select-request-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="access">Access My Data</SelectItem>
                          <SelectItem value="delete">Delete My Data</SelectItem>
                          <SelectItem value="rectify">Correct My Data</SelectItem>
                          <SelectItem value="portability">Export My Data</SelectItem>
                          <SelectItem value="restrict">Restrict Processing</SelectItem>
                          <SelectItem value="object">Object to Processing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="verification">Verification Method</Label>
                      <Select 
                        value={dsarForm.verificationMethod} 
                        onValueChange={(value: any) => setDsarForm({...dsarForm, verificationMethod: value})}
                      >
                        <SelectTrigger className="bg-cosmic border-primary/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email Verification</SelectItem>
                          <SelectItem value="account_access">Account Access</SelectItem>
                          <SelectItem value="identity_document">Identity Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Additional Information (Optional)</Label>
                      <Textarea
                        id="description"
                        value={dsarForm.description}
                        onChange={(e) => setDsarForm({...dsarForm, description: e.target.value})}
                        placeholder="Provide any additional context for your request..."
                        className="bg-cosmic border-primary/20 text-white"
                        data-testid="textarea-description"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={dsarMutation.isPending}
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                      data-testid="button-submit-dsar"
                    >
                      {dsarMutation.isPending ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ccpa" className="space-y-6">
              <Card className="bg-cosmic/50 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">California Consumer Privacy Act (CCPA)</CardTitle>
                  <CardDescription className="text-white/70">
                    Exercise your rights under the California Consumer Privacy Act.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Do Not Sell My Personal Information</h3>
                    <p className="text-white/70">
                      Under CCPA, you have the right to opt out of the sale of your personal information.
                    </p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ccpa-email">Email Address</Label>
                      <Input
                        id="ccpa-email"
                        type="email"
                        value={dsarForm.email}
                        onChange={(e) => setDsarForm({...dsarForm, email: e.target.value})}
                        placeholder="Enter your email address"
                        className="bg-cosmic border-primary/20 text-white"
                        data-testid="input-ccpa-email"
                      />
                    </div>

                    <Button 
                      onClick={handleDoNotSell}
                      disabled={doNotSellMutation.isPending}
                      className="bg-gradient-to-r from-orange-500 to-red-500"
                      data-testid="button-do-not-sell"
                    >
                      {doNotSellMutation.isPending ? 'Processing...' : 'Do Not Sell My Information'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}