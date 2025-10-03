import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { Shield, FileText, CheckCircle } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';

interface DataSubjectRequest {
  email: string;
  requestType: 'access' | 'delete' | 'rectify' | 'portability' | 'restrict' | 'object';
  description?: string;
  verificationMethod: 'email' | 'identity_document' | 'account_access';
  turnstileToken?: string;
}

export default function DSARPage() {
  const { toast } = useToast();
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<string>('');

  const [dsarForm, setDsarForm] = useState<DataSubjectRequest>({
    email: '',
    requestType: 'access',
    description: '',
    verificationMethod: 'email'
  });

  // Check if Turnstile should be enabled
  const isProductionDomain = () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'ascended.social' || hostname === 'dev.ascended.social';
  };

  const shouldUseTurnstile = isProductionDomain();

  const dsarMutation = useMutation({
    mutationFn: (request: DataSubjectRequest) =>
      fetch('/api/privacy/dsar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...request,
          turnstileToken: shouldUseTurnstile ? turnstileToken : undefined
        })
      }).then(res => res.json()),
    onSuccess: (data: any) => {
      setRequestId(data.requestId);
      setIsSubmitted(true);
      toast({
        title: "Request Submitted Successfully",
        description: `Your ${dsarForm.requestType} request has been submitted. Request ID: ${data.requestId}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit data request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (shouldUseTurnstile && !turnstileToken) {
      toast({
        title: "Security verification required",
        description: "Please complete the security verification to continue.",
        variant: "destructive",
      });
      return;
    }

    dsarMutation.mutate(dsarForm);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-md border-purple-500/30">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-white">Request Submitted Successfully</CardTitle>
              <CardDescription className="text-purple-200">
                Your data subject access request has been received and is being processed.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-purple-900/30 rounded-lg p-6 border border-purple-400/20">
                <p className="text-purple-200 mb-2">Request ID:</p>
                <p className="text-white font-mono text-lg">{requestId}</p>
              </div>
              <p className="text-purple-200">
                You will receive an email at <span className="text-white font-semibold">{dsarForm.email}</span> with further instructions.
              </p>
              <p className="text-purple-300 text-sm">
                We aim to process your request within 30 days in accordance with GDPR and CCPA regulations.
              </p>
              <Link href="/">
                <Button className="mt-4" data-testid="button-home">
                  Return to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4" data-testid="text-page-title">
            Data Subject Access Request (DSAR)
          </h1>
          <p className="text-xl text-purple-200">
            Exercise your privacy rights under GDPR and CCPA
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Submit Your Request
            </CardTitle>
            <CardDescription className="text-purple-200">
              Please provide the following information to submit your data subject access request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={dsarForm.email}
                  onChange={(e) => setDsarForm({...dsarForm, email: e.target.value})}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50"
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestType" className="text-white">Request Type *</Label>
                <Select 
                  value={dsarForm.requestType} 
                  onValueChange={(value: any) => setDsarForm({...dsarForm, requestType: value})}
                >
                  <SelectTrigger className="bg-white/10 border-purple-500/30 text-white" data-testid="select-request-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="access">Access - Request a copy of my data</SelectItem>
                    <SelectItem value="delete">Deletion - Delete my personal data</SelectItem>
                    <SelectItem value="rectify">Rectification - Correct inaccurate data</SelectItem>
                    <SelectItem value="portability">Portability - Transfer my data</SelectItem>
                    <SelectItem value="restrict">Restriction - Limit processing of my data</SelectItem>
                    <SelectItem value="object">Objection - Object to data processing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationMethod" className="text-white">Verification Method *</Label>
                <Select 
                  value={dsarForm.verificationMethod} 
                  onValueChange={(value: any) => setDsarForm({...dsarForm, verificationMethod: value})}
                >
                  <SelectTrigger className="bg-white/10 border-purple-500/30 text-white" data-testid="select-verification">
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
                <Label htmlFor="description" className="text-white">Additional Details (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide any additional information about your request..."
                  value={dsarForm.description}
                  onChange={(e) => setDsarForm({...dsarForm, description: e.target.value})}
                  className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 min-h-[100px]"
                  data-testid="textarea-description"
                />
              </div>

              {shouldUseTurnstile && (
                <div className="flex justify-center">
                  <Turnstile
                    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                    onSuccess={setTurnstileToken}
                    onError={() => console.error('Turnstile verification failed')}
                    onExpire={() => setTurnstileToken('')}
                  />
                </div>
              )}

              <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-400/20">
                <p className="text-purple-200 text-sm">
                  <strong>Privacy Notice:</strong> Your request will be processed in accordance with GDPR and CCPA regulations.
                  We will verify your identity before processing any request. Your data is stored securely on our EU-based
                  Cloudflare D1 database and managed through Fides privacy infrastructure with Probo audit logging.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={dsarMutation.isPending}
                data-testid="button-submit"
              >
                {dsarMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/">
                <span className="text-purple-300 hover:text-white transition-colors text-sm cursor-pointer">
                  ← Back to Home
                </span>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-purple-300 text-sm">
          <p>For questions about your privacy rights, contact us at:</p>
          <a href="mailto:privacy@ascended.social" className="text-white hover:text-purple-200">
            privacy@ascended.social
          </a>
          <p className="mt-2">
            EU Representative: <strong>Prighter</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
