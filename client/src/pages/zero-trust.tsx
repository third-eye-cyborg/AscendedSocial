import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Users, 
  Settings, 
  Key, 
  Eye, 
  Plus, 
  Trash2, 
  Edit,
  CheckCircle,
  XCircle,
  Activity,
  Globe,
  Lock,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ZeroTrustStatus {
  isConfigured: boolean;
  config?: {
    teamDomain: string;
    accountId: string;
    hasApiToken: boolean;
    hasAudTag: boolean;
  };
  features: {
    applicationProtection: boolean;
    accessPolicies: boolean;
    userManagement: boolean;
    servicetokens: boolean;
    accessLogs: boolean;
  };
}

interface AccessApplication {
  id?: string;
  name: string;
  domain: string;
  type: 'self_hosted' | 'saas' | 'ssh' | 'vnc' | 'app_launcher';
  session_duration?: string;
  auto_redirect_to_identity?: boolean;
  enable_binding_cookie?: boolean;
}

interface AccessPolicy {
  id?: string;
  name: string;
  decision: 'allow' | 'deny' | 'non_identity' | 'bypass';
  precedence?: number;
  include: any[];
  exclude?: any[];
  require?: any[];
  session_duration?: string;
}

interface AccessGroup {
  id?: string;
  name: string;
  include: any[];
  exclude?: any[];
  require?: any[];
}

interface ServiceToken {
  id?: string;
  name: string;
  client_id?: string;
  client_secret?: string;
  duration?: string;
}

export default function ZeroTrustPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Zero Trust status
  const { data: status, isLoading: statusLoading } = useQuery<ZeroTrustStatus>({
    queryKey: ['/api/zero-trust/status'],
  });

  // Fetch current user's Zero Trust info
  const { data: userInfo } = useQuery({
    queryKey: ['/api/zero-trust/user'],
  });

  // Fetch applications
  const { data: applications = [], isLoading: appsLoading } = useQuery<AccessApplication[]>({
    queryKey: ['/api/zero-trust/applications'],
    enabled: status?.isConfigured,
  });

  // Fetch policies
  const { data: policies = [], isLoading: policiesLoading } = useQuery<AccessPolicy[]>({
    queryKey: ['/api/zero-trust/policies'],
    enabled: status?.isConfigured,
  });

  // Fetch groups
  const { data: groups = [], isLoading: groupsLoading } = useQuery<AccessGroup[]>({
    queryKey: ['/api/zero-trust/groups'],
    enabled: status?.isConfigured,
  });

  // Fetch service tokens
  const { data: serviceTokens = [], isLoading: tokensLoading } = useQuery<ServiceToken[]>({
    queryKey: ['/api/zero-trust/service-tokens'],
    enabled: status?.isConfigured,
  });

  // Setup defaults mutation
  const setupDefaultsMutation = useMutation({
    mutationFn: () => apiRequest('/api/zero-trust/setup-defaults', 'POST'),
    onSuccess: () => {
      toast({
        title: "Setup Complete",
        description: "Spiritual platform defaults have been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/zero-trust'] });
    },
    onError: (error: any) => {
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to setup defaults",
        variant: "destructive",
      });
    },
  });

  if (statusLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded mb-4"></div>
          <div className="h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!status?.isConfigured) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-2 border-dashed border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Zero Trust Not Configured
            </CardTitle>
            <CardDescription className="text-lg">
              Cloudflare Zero Trust integration is not yet set up for enhanced security.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-white rounded-lg p-4 border border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-2">Missing Configuration:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>CLOUDFLARE_TEAM_DOMAIN</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>CLOUDFLARE_AUD_TAG</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">
              Once these environment variables are configured, Zero Trust security features will be available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Shield className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Zero Trust Security</h1>
            <p className="text-blue-100">Enterprise-grade access control and identity management</p>
          </div>
        </div>
        
        {userInfo?.authenticated && (
          <div className="bg-white/10 rounded-lg p-4 mt-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-300" />
              <div>
                <p className="font-medium">Authenticated as {userInfo.user.email}</p>
                <p className="text-sm text-blue-200">
                  Groups: {userInfo.user.groups?.join(', ') || 'None'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Status</p>
                <p className="text-lg font-bold text-green-900">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">Team Domain</p>
                <p className="text-lg font-bold text-blue-900">{status.config?.teamDomain}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800">Applications</p>
                <p className="text-lg font-bold text-purple-900">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-800">Policies</p>
                <p className="text-lg font-bold text-orange-900">{policies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Defaults Button */}
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-indigo-900">Quick Setup</h3>
              <p className="text-indigo-700">Create default spiritual platform access policies and groups</p>
            </div>
            <Button 
              onClick={() => setupDefaultsMutation.mutate()}
              disabled={setupDefaultsMutation.isPending}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              data-testid="button-setup-defaults"
            >
              {setupDefaultsMutation.isPending ? 'Setting up...' : 'Setup Defaults'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="tokens" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Tokens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Token</span>
                  <Badge variant={status.config?.hasApiToken ? "default" : "destructive"}>
                    {status.config?.hasApiToken ? "Configured" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AUD Tag</span>
                  <Badge variant={status.config?.hasAudTag ? "default" : "destructive"}>
                    {status.config?.hasAudTag ? "Configured" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account ID</span>
                  <Badge variant="outline">{status.config?.accountId}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Current Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userInfo?.authenticated ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-lg">{userInfo.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Groups</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {userInfo.user.groups?.map((group: string) => (
                          <Badge key={group} variant="secondary">{group}</Badge>
                        )) || <span className="text-gray-500">No groups</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Identity Provider</p>
                      <p className="text-sm text-gray-600">{userInfo.user.identity_provider || 'Unknown'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No Zero Trust authentication detected</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Access Applications</CardTitle>
                <CardDescription>Manage protected applications and their configurations</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {appsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-100 h-16 rounded-lg"></div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No applications configured yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{app.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{app.domain}</span>
                          <Badge variant="outline">{app.type}</Badge>
                          {app.session_duration && (
                            <span>Session: {app.session_duration}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" data-testid={`button-edit-app-${app.id}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Access Policies</CardTitle>
              <CardDescription>Control who can access your applications</CardDescription>
            </CardHeader>
            <CardContent>
              {policiesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gray-100 h-16 rounded-lg"></div>
                  ))}
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No policies configured yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {policies.map((policy) => (
                    <div key={policy.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{policy.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={policy.decision === 'allow' ? 'default' : policy.decision === 'deny' ? 'destructive' : 'secondary'}
                          >
                            {policy.decision}
                          </Badge>
                          <span className="text-sm text-gray-500">Precedence: {policy.precedence}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Include rules: {policy.include?.length || 0}</p>
                        {policy.exclude && <p>Exclude rules: {policy.exclude.length}</p>}
                        {policy.require && <p>Require rules: {policy.require.length}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Tokens</CardTitle>
              <CardDescription>Manage machine-to-machine authentication tokens</CardDescription>
            </CardHeader>
            <CardContent>
              {tokensLoading ? (
                <div className="space-y-3">
                  {[1, 2].map(i => (
                    <div key={i} className="animate-pulse bg-gray-100 h-16 rounded-lg"></div>
                  ))}
                </div>
              ) : serviceTokens.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Key className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No service tokens configured yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {serviceTokens.map((token) => (
                    <div key={token.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{token.name}</h4>
                        <p className="text-sm text-gray-600">Client ID: {token.client_id}</p>
                      </div>
                      <Button variant="outline" size="sm" data-testid={`button-delete-token-${token.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}