import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Cookie, Eye, Settings, Download, Trash2 } from 'lucide-react';
import { useConsent } from '@/lib/consent';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export function PrivacyConsentBanner() {
  const { hasConsented, acceptAll, rejectAll, setPreferences } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setLocalPreferences] = useState({
    analytics: false,
    marketing: false,
    functional: true,
    necessary: true,
  });

  // Don't show banner if user has already consented
  if (hasConsented) return null;

  const handleCustomize = () => {
    setPreferences(preferences);
    setShowDetails(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Your Privacy Matters</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We use cookies and analytics to enhance your spiritual journey on our platform. 
                      You can customize your privacy preferences anytime.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                    data-testid="button-customize-privacy"
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Customize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rejectAll}
                    data-testid="button-reject-all"
                  >
                    Reject All
                  </Button>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    data-testid="button-accept-all"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy Preferences
            </DialogTitle>
            <DialogDescription>
              Choose which types of cookies and data processing you're comfortable with.
              You can change these settings anytime.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Necessary Cookies */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cookie className="h-4 w-4 text-green-600" />
                  <Label className="font-medium">Essential Cookies</Label>
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                </div>
                <Switch checked={true} disabled />
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                These cookies are essential for basic site functionality, user authentication, and security.
                They cannot be disabled.
              </p>
            </div>

            <Separator />

            {/* Analytics */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <Label className="font-medium">Analytics & Performance</Label>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => 
                    setLocalPreferences(prev => ({ ...prev, analytics: checked }))
                  }
                  data-testid="switch-analytics"
                />
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                Help us understand how you use our platform to improve your spiritual experience.
                Includes usage patterns, feature engagement, and error tracking.
              </p>
            </div>

            <Separator />

            {/* Marketing */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-purple-600" />
                  <Label className="font-medium">Marketing & Personalization</Label>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked) => 
                    setLocalPreferences(prev => ({ ...prev, marketing: checked }))
                  }
                  data-testid="switch-marketing"
                />
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                Receive personalized spiritual content recommendations and relevant updates about our platform.
              </p>
            </div>

            <Separator />

            {/* Functional */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <Label className="font-medium">Functional Enhancements</Label>
                </div>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={(checked) => 
                    setLocalPreferences(prev => ({ ...prev, functional: checked }))
                  }
                  data-testid="switch-functional"
                />
              </div>
              <p className="text-sm text-muted-foreground pl-6">
                Remember your preferences like theme, language, and personalized dashboard settings.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
                data-testid="button-cancel-preferences"
              >
                Cancel
              </Button>
              <Button onClick={handleCustomize} data-testid="button-save-preferences">
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function PrivacySettings() {
  const { 
    consentState, 
    hasAnalyticsConsent, 
    hasMarketingConsent, 
    hasFunctionalConsent,
    setPreferences,
    clearConsent 
  } = useConsent();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleDataExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/privacy/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com', // This should come from user context
          dataTypes: ['analytics', 'profile', 'posts', 'comments']
        })
      });
      
      if (response.ok) {
        alert('Data export request submitted! You will receive an email when ready.');
      } else {
        alert('Failed to submit data export request. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting data export:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataDeletion = async () => {
    if (!confirm('Are you sure you want to request deletion of your data? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/privacy/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com', // This should come from user context
          deleteTypes: ['all'],
          reason: 'User requested account deletion'
        })
      });
      
      if (response.ok) {
        alert('Data deletion request submitted! You will receive confirmation when complete.');
        clearConsent();
      } else {
        alert('Failed to submit data deletion request. Please try again.');
      }
    } catch (error) {
      console.error('Error requesting data deletion:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy & Data Protection
          </CardTitle>
          <CardDescription>
            Manage your privacy preferences and data protection settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Consent Status */}
          <div className="space-y-4">
            <h4 className="font-medium">Current Privacy Settings</h4>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Analytics & Performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={hasAnalyticsConsent ? "default" : "outline"}>
                    {hasAnalyticsConsent ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={hasAnalyticsConsent}
                    onCheckedChange={(checked) => 
                      setPreferences({
                        analytics: checked,
                        marketing: hasMarketingConsent,
                        functional: hasFunctionalConsent,
                        necessary: true
                      })
                    }
                    data-testid="switch-analytics-settings"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Marketing & Personalization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={hasMarketingConsent ? "default" : "outline"}>
                    {hasMarketingConsent ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={hasMarketingConsent}
                    onCheckedChange={(checked) => 
                      setPreferences({
                        analytics: hasAnalyticsConsent,
                        marketing: checked,
                        functional: hasFunctionalConsent,
                        necessary: true
                      })
                    }
                    data-testid="switch-marketing-settings"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Functional Enhancements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={hasFunctionalConsent ? "default" : "outline"}>
                    {hasFunctionalConsent ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={hasFunctionalConsent}
                    onCheckedChange={(checked) => 
                      setPreferences({
                        analytics: hasAnalyticsConsent,
                        marketing: hasMarketingConsent,
                        functional: checked,
                        necessary: true
                      })
                    }
                    data-testid="switch-functional-settings"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Data Rights */}
          <div className="space-y-4">
            <h4 className="font-medium">Your Data Rights</h4>
            <p className="text-sm text-muted-foreground">
              Under GDPR and other privacy laws, you have the right to access, export, and delete your personal data.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleDataExport}
                disabled={isLoading}
                className="flex items-center gap-2"
                data-testid="button-export-data"
              >
                <Download className="h-4 w-4" />
                Export My Data
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDataDeletion}
                disabled={isLoading}
                className="flex items-center gap-2 text-destructive hover:text-destructive"
                data-testid="button-delete-data"
              >
                <Trash2 className="h-4 w-4" />
                Request Data Deletion
              </Button>
            </div>
          </div>

          {consentState && (
            <>
              <Separator />
              <div className="text-xs text-muted-foreground">
                <p>Consent given: {new Date(consentState.timestamp).toLocaleString()}</p>
                <p>Consent version: {consentState.version}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}