import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Camera, 
  FileText, 
  Search, 
  FormInput, 
  Activity, 
  Code, 
  Settings,
  Download,
  Eye,
  RefreshCw,
  Play,
  AlertCircle,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

interface BrowserlessHealth {
  status: string;
  browserless: boolean;
  playwright: boolean;
  puppeteer: boolean;
}

interface ScreenshotOptions {
  fullPage?: boolean;
  width?: number;
  height?: number;
  format?: 'png' | 'jpeg';
  quality?: number;
}

interface PDFOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  landscape?: boolean;
  printBackground?: boolean;
}

interface ScrapeOptions {
  selector?: string;
  waitForSelector?: string;
  timeout?: number;
  extractText?: boolean;
  extractLinks?: boolean;
  extractImages?: boolean;
}

interface FormField {
  selector: string;
  value: string;
  type?: 'input' | 'select' | 'textarea' | 'checkbox' | 'radio';
}

export default function BrowserlessPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // States for different operations
  const [screenshotUrl, setScreenshotUrl] = useState('https://example.com');
  const [screenshotEngine, setScreenshotEngine] = useState<'playwright' | 'puppeteer'>('playwright');
  const [screenshotOptions, setScreenshotOptions] = useState<ScreenshotOptions>({
    fullPage: true,
    width: 1920,
    height: 1080,
    format: 'png'
  });

  const [pdfUrl, setPdfUrl] = useState('https://example.com');
  const [pdfEngine, setPdfEngine] = useState<'playwright' | 'puppeteer'>('playwright');
  const [pdfOptions, setPdfOptions] = useState<PDFOptions>({
    format: 'A4',
    landscape: false,
    printBackground: true
  });

  const [scrapeUrl, setScrapeUrl] = useState('https://example.com');
  const [scrapeEngine, setScrapeEngine] = useState<'playwright' | 'puppeteer'>('playwright');
  const [scrapeOptions, setScrapeOptions] = useState<ScrapeOptions>({
    extractText: true,
    extractLinks: true,
    extractImages: false,
    timeout: 30000
  });

  const [formUrl, setFormUrl] = useState('https://example.com/form');
  const [formEngine, setFormEngine] = useState<'playwright' | 'puppeteer'>('playwright');
  const [formFields, setFormFields] = useState<FormField[]>([
    { selector: '#email', value: 'test@example.com', type: 'input' }
  ]);
  const [submitSelector, setSubmitSelector] = useState('#submit');

  const [customUrl, setCustomUrl] = useState('https://example.com');
  const [customScript, setCustomScript] = useState('return document.title;');

  const [batchOperations, setBatchOperations] = useState([
    { type: 'screenshot', url: 'https://example.com', engine: 'playwright' }
  ]);

  // Health check query
  const { data: health, isLoading: healthLoading } = useQuery<BrowserlessHealth>({
    queryKey: ['/api/browserless/health'],
    refetchInterval: 30000
  });

  // Mutations for different operations
  const screenshotMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/browserless/screenshot', 'POST', data),
    onSuccess: (data) => {
      toast({
        title: "Screenshot taken successfully",
        description: "Screenshot captured and ready for download"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Screenshot failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const pdfMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/browserless/pdf', 'POST', data),
    onSuccess: (data) => {
      toast({
        title: "PDF generated successfully",
        description: "PDF created and ready for download"
      });
    },
    onError: (error: any) => {
      toast({
        title: "PDF generation failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const scrapeMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/browserless/scrape', 'POST', data),
    onSuccess: (data) => {
      toast({
        title: "Content scraped successfully",
        description: "Data extracted from the webpage"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Scraping failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const formMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/browserless/fill-form', 'POST', data),
    onSuccess: (data) => {
      toast({
        title: "Form filled successfully",
        description: "Form submission completed"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Form filling failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const performanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/browserless/performance', 'POST', data),
    onSuccess: (data) => {
      toast({
        title: "Performance test completed",
        description: "Performance metrics collected"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Performance test failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const customScriptMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/browserless/execute', 'POST', data),
    onSuccess: (data) => {
      toast({
        title: "Script executed successfully",
        description: "Custom script completed"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Script execution failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const batchMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/browserless/batch', 'POST', data),
    onSuccess: (data) => {
      toast({
        title: "Batch operations completed",
        description: `${data.data.completed} operations successful, ${data.data.failed} failed`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Batch operations failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleScreenshot = () => {
    screenshotMutation.mutate({
      url: screenshotUrl,
      engine: screenshotEngine,
      options: screenshotOptions
    });
  };

  const handlePDF = () => {
    pdfMutation.mutate({
      url: pdfUrl,
      engine: pdfEngine,
      options: pdfOptions
    });
  };

  const handleScrape = () => {
    scrapeMutation.mutate({
      url: scrapeUrl,
      engine: scrapeEngine,
      options: scrapeOptions
    });
  };

  const handleFormFill = () => {
    formMutation.mutate({
      url: formUrl,
      engine: formEngine,
      formData: formFields,
      submitSelector: submitSelector || undefined
    });
  };

  const handlePerformanceTest = () => {
    performanceMutation.mutate({ url: scrapeUrl });
  };

  const handleCustomScript = () => {
    customScriptMutation.mutate({
      url: customUrl,
      script: customScript
    });
  };

  const handleBatchOperations = () => {
    batchMutation.mutate({
      operations: batchOperations
    });
  };

  const addFormField = () => {
    setFormFields([...formFields, { selector: '', value: '', type: 'input' }]);
  };

  const updateFormField = (index: number, field: Partial<FormField>) => {
    const updated = [...formFields];
    updated[index] = { ...updated[index], ...field };
    setFormFields(updated);
  };

  const removeFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const downloadFile = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const HealthIndicator = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Browserless Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {healthLoading ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Checking status...</span>
          </div>
        ) : health ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${health.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm">Overall: {health.status}</span>
            </div>
            <div className="flex items-center gap-2">
              {health.browserless ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Browserless</span>
            </div>
            <div className="flex items-center gap-2">
              {health.playwright ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Playwright</span>
            </div>
            <div className="flex items-center gap-2">
              {health.puppeteer ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4 text-red-500" />}
              <span className="text-sm">Puppeteer</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-4 w-4" />
            <span>Unable to connect to Browserless service</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950/20 via-blue-950/20 to-indigo-950/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
            Browser Automation
          </h1>
          <p className="text-gray-300">
            Comprehensive web automation using Browserless with Playwright and Puppeteer
          </p>
        </div>

        <HealthIndicator />

        <Tabs defaultValue="screenshot" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
            <TabsTrigger value="screenshot" data-testid="tab-screenshot">
              <Camera className="h-4 w-4 mr-2" />
              Screenshots
            </TabsTrigger>
            <TabsTrigger value="pdf" data-testid="tab-pdf">
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </TabsTrigger>
            <TabsTrigger value="scrape" data-testid="tab-scrape">
              <Search className="h-4 w-4 mr-2" />
              Scraping
            </TabsTrigger>
            <TabsTrigger value="forms" data-testid="tab-forms">
              <FormInput className="h-4 w-4 mr-2" />
              Forms
            </TabsTrigger>
            <TabsTrigger value="performance" data-testid="tab-performance">
              <Activity className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="custom" data-testid="tab-custom">
              <Code className="h-4 w-4 mr-2" />
              Custom
            </TabsTrigger>
            <TabsTrigger value="batch" data-testid="tab-batch">
              <Settings className="h-4 w-4 mr-2" />
              Batch
            </TabsTrigger>
          </TabsList>

          {/* Screenshot Tab */}
          <TabsContent value="screenshot">
            <Card>
              <CardHeader>
                <CardTitle>Take Screenshot</CardTitle>
                <CardDescription>
                  Capture full page or specific area screenshots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="screenshot-url">URL</Label>
                    <Input
                      id="screenshot-url"
                      value={screenshotUrl}
                      onChange={(e) => setScreenshotUrl(e.target.value)}
                      placeholder="https://example.com"
                      data-testid="input-screenshot-url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="screenshot-engine">Engine</Label>
                    <Select value={screenshotEngine} onValueChange={(value: 'playwright' | 'puppeteer') => setScreenshotEngine(value)}>
                      <SelectTrigger data-testid="select-screenshot-engine">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="playwright">Playwright</SelectItem>
                        <SelectItem value="puppeteer">Puppeteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="screenshot-width">Width</Label>
                    <Input
                      id="screenshot-width"
                      type="number"
                      value={screenshotOptions.width}
                      onChange={(e) => setScreenshotOptions({...screenshotOptions, width: parseInt(e.target.value)})}
                      data-testid="input-screenshot-width"
                    />
                  </div>
                  <div>
                    <Label htmlFor="screenshot-height">Height</Label>
                    <Input
                      id="screenshot-height"
                      type="number"
                      value={screenshotOptions.height}
                      onChange={(e) => setScreenshotOptions({...screenshotOptions, height: parseInt(e.target.value)})}
                      data-testid="input-screenshot-height"
                    />
                  </div>
                  <div>
                    <Label htmlFor="screenshot-format">Format</Label>
                    <Select 
                      value={screenshotOptions.format} 
                      onValueChange={(value: 'png' | 'jpeg') => setScreenshotOptions({...screenshotOptions, format: value})}
                    >
                      <SelectTrigger data-testid="select-screenshot-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="screenshot-fullpage"
                      checked={screenshotOptions.fullPage}
                      onCheckedChange={(checked) => setScreenshotOptions({...screenshotOptions, fullPage: checked})}
                      data-testid="switch-screenshot-fullpage"
                    />
                    <Label htmlFor="screenshot-fullpage">Full Page</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleScreenshot} 
                    disabled={screenshotMutation.isPending}
                    data-testid="button-take-screenshot"
                  >
                    {screenshotMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    Take Screenshot
                  </Button>
                  {screenshotMutation.data?.data.image && (
                    <Button
                      variant="outline"
                      onClick={() => downloadFile(screenshotMutation.data?.data.image, `screenshot-${Date.now()}.${screenshotOptions.format}`)}
                      data-testid="button-download-screenshot"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                {screenshotMutation.data?.data.image && (
                  <div className="mt-4">
                    <img 
                      src={screenshotMutation.data?.data.image} 
                      alt="Screenshot"
                      className="max-w-full h-auto border rounded-lg"
                      data-testid="img-screenshot-result"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PDF Tab */}
          <TabsContent value="pdf">
            <Card>
              <CardHeader>
                <CardTitle>Generate PDF</CardTitle>
                <CardDescription>
                  Convert web pages to PDF documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pdf-url">URL</Label>
                    <Input
                      id="pdf-url"
                      value={pdfUrl}
                      onChange={(e) => setPdfUrl(e.target.value)}
                      placeholder="https://example.com"
                      data-testid="input-pdf-url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pdf-engine">Engine</Label>
                    <Select value={pdfEngine} onValueChange={(value: 'playwright' | 'puppeteer') => setPdfEngine(value)}>
                      <SelectTrigger data-testid="select-pdf-engine">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="playwright">Playwright</SelectItem>
                        <SelectItem value="puppeteer">Puppeteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="pdf-format">Format</Label>
                    <Select 
                      value={pdfOptions.format} 
                      onValueChange={(value: 'A4' | 'Letter' | 'Legal') => setPdfOptions({...pdfOptions, format: value})}
                    >
                      <SelectTrigger data-testid="select-pdf-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="Letter">Letter</SelectItem>
                        <SelectItem value="Legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pdf-landscape"
                      checked={pdfOptions.landscape}
                      onCheckedChange={(checked) => setPdfOptions({...pdfOptions, landscape: checked})}
                      data-testid="switch-pdf-landscape"
                    />
                    <Label htmlFor="pdf-landscape">Landscape</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="pdf-background"
                      checked={pdfOptions.printBackground}
                      onCheckedChange={(checked) => setPdfOptions({...pdfOptions, printBackground: checked})}
                      data-testid="switch-pdf-background"
                    />
                    <Label htmlFor="pdf-background">Print Background</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handlePDF} 
                    disabled={pdfMutation.isPending}
                    data-testid="button-generate-pdf"
                  >
                    {pdfMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2" />
                    )}
                    Generate PDF
                  </Button>
                  {pdfMutation.data?.data.pdf && (
                    <Button
                      variant="outline"
                      onClick={() => downloadFile(pdfMutation.data.data.pdf, `document-${Date.now()}.pdf`)}
                      data-testid="button-download-pdf"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scraping Tab */}
          <TabsContent value="scrape">
            <Card>
              <CardHeader>
                <CardTitle>Web Scraping</CardTitle>
                <CardDescription>
                  Extract content, links, and data from web pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scrape-url">URL</Label>
                    <Input
                      id="scrape-url"
                      value={scrapeUrl}
                      onChange={(e) => setScrapeUrl(e.target.value)}
                      placeholder="https://example.com"
                      data-testid="input-scrape-url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scrape-engine">Engine</Label>
                    <Select value={scrapeEngine} onValueChange={(value: 'playwright' | 'puppeteer') => setScrapeEngine(value)}>
                      <SelectTrigger data-testid="select-scrape-engine">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="playwright">Playwright</SelectItem>
                        <SelectItem value="puppeteer">Puppeteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scrape-selector">CSS Selector (optional)</Label>
                    <Input
                      id="scrape-selector"
                      value={scrapeOptions.selector || ''}
                      onChange={(e) => setScrapeOptions({...scrapeOptions, selector: e.target.value || undefined})}
                      placeholder="e.g., .content, #main"
                      data-testid="input-scrape-selector"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scrape-wait">Wait for selector (optional)</Label>
                    <Input
                      id="scrape-wait"
                      value={scrapeOptions.waitForSelector || ''}
                      onChange={(e) => setScrapeOptions({...scrapeOptions, waitForSelector: e.target.value || undefined})}
                      placeholder="e.g., .loaded"
                      data-testid="input-scrape-wait"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="scrape-text"
                      checked={scrapeOptions.extractText}
                      onCheckedChange={(checked) => setScrapeOptions({...scrapeOptions, extractText: checked})}
                      data-testid="switch-scrape-text"
                    />
                    <Label htmlFor="scrape-text">Extract Text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="scrape-links"
                      checked={scrapeOptions.extractLinks}
                      onCheckedChange={(checked) => setScrapeOptions({...scrapeOptions, extractLinks: checked})}
                      data-testid="switch-scrape-links"
                    />
                    <Label htmlFor="scrape-links">Extract Links</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="scrape-images"
                      checked={scrapeOptions.extractImages}
                      onCheckedChange={(checked) => setScrapeOptions({...scrapeOptions, extractImages: checked})}
                      data-testid="switch-scrape-images"
                    />
                    <Label htmlFor="scrape-images">Extract Images</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleScrape} 
                    disabled={scrapeMutation.isPending}
                    data-testid="button-scrape"
                  >
                    {scrapeMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Scrape Content
                  </Button>
                  <Button 
                    onClick={handlePerformanceTest} 
                    disabled={performanceMutation.isPending}
                    variant="outline"
                    data-testid="button-performance"
                  >
                    {performanceMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Activity className="h-4 w-4 mr-2" />
                    )}
                    Performance Test
                  </Button>
                </div>

                {scrapeMutation.data?.data && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Scraped Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
                        {JSON.stringify(scrapeMutation.data.data, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                {performanceMutation.data?.data && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Load Time</Label>
                          <div className="text-lg font-semibold">
                            {performanceMutation.data.data.metrics.totalLoadTime}ms
                          </div>
                        </div>
                        <div>
                          <Label>DOM Content Loaded</Label>
                          <div className="text-lg font-semibold">
                            {Math.round(performanceMutation.data.data.metrics.domContentLoaded)}ms
                          </div>
                        </div>
                        <div>
                          <Label>First Paint</Label>
                          <div className="text-lg font-semibold">
                            {Math.round(performanceMutation.data.data.metrics.firstPaint)}ms
                          </div>
                        </div>
                        <div>
                          <Label>First Contentful Paint</Label>
                          <div className="text-lg font-semibold">
                            {Math.round(performanceMutation.data.data.metrics.firstContentfulPaint)}ms
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Form Automation</CardTitle>
                <CardDescription>
                  Automatically fill and submit web forms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="form-url">Form URL</Label>
                    <Input
                      id="form-url"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="https://example.com/form"
                      data-testid="input-form-url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="form-engine">Engine</Label>
                    <Select value={formEngine} onValueChange={(value: 'playwright' | 'puppeteer') => setFormEngine(value)}>
                      <SelectTrigger data-testid="select-form-engine">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="playwright">Playwright</SelectItem>
                        <SelectItem value="puppeteer">Puppeteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="submit-selector">Submit Button Selector (optional)</Label>
                  <Input
                    id="submit-selector"
                    value={submitSelector}
                    onChange={(e) => setSubmitSelector(e.target.value)}
                    placeholder="e.g., #submit, button[type='submit']"
                    data-testid="input-submit-selector"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Form Fields</Label>
                    <Button onClick={addFormField} size="sm" variant="outline" data-testid="button-add-field">
                      Add Field
                    </Button>
                  </div>
                  
                  {formFields.map((field, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-4">
                        <Input
                          placeholder="CSS Selector"
                          value={field.selector}
                          onChange={(e) => updateFormField(index, { selector: e.target.value })}
                          data-testid={`input-field-selector-${index}`}
                        />
                      </div>
                      <div className="col-span-4">
                        <Input
                          placeholder="Value"
                          value={field.value}
                          onChange={(e) => updateFormField(index, { value: e.target.value })}
                          data-testid={`input-field-value-${index}`}
                        />
                      </div>
                      <div className="col-span-3">
                        <Select 
                          value={field.type} 
                          onValueChange={(value: any) => updateFormField(index, { type: value })}
                        >
                          <SelectTrigger data-testid={`select-field-type-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="input">Input</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="checkbox">Checkbox</SelectItem>
                            <SelectItem value="radio">Radio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Button 
                          onClick={() => removeFormField(index)} 
                          size="sm" 
                          variant="destructive"
                          data-testid={`button-remove-field-${index}`}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleFormFill} 
                  disabled={formMutation.isPending}
                  data-testid="button-fill-form"
                >
                  {formMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FormInput className="h-4 w-4 mr-2" />
                  )}
                  Fill Form
                </Button>

                {formMutation.data?.data?.screenshot && (
                  <div className="mt-4">
                    <Label>Form Submission Result</Label>
                    <img 
                      src={formMutation.data.data.screenshot} 
                      alt="Form Result"
                      className="max-w-full h-auto border rounded-lg mt-2"
                      data-testid="img-form-result"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
                <CardDescription>
                  Analyze website performance metrics and loading times
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="perf-url">URL to Test</Label>
                  <Input
                    id="perf-url"
                    value={scrapeUrl}
                    onChange={(e) => setScrapeUrl(e.target.value)}
                    placeholder="https://example.com"
                    data-testid="input-performance-url"
                  />
                </div>

                <Button 
                  onClick={handlePerformanceTest} 
                  disabled={performanceMutation.isPending}
                  data-testid="button-run-performance"
                >
                  {performanceMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Activity className="h-4 w-4 mr-2" />
                  )}
                  Run Performance Test
                </Button>

                {performanceMutation.data?.data && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-400">
                            {performanceMutation.data.data.metrics.totalLoadTime}ms
                          </div>
                          <div className="text-sm text-gray-400">Total Load Time</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-400">
                            {Math.round(performanceMutation.data.data.metrics.firstPaint)}ms
                          </div>
                          <div className="text-sm text-gray-400">First Paint</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-purple-400">
                            {Math.round(performanceMutation.data.data.metrics.firstContentfulPaint)}ms
                          </div>
                          <div className="text-sm text-gray-400">First Contentful Paint</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-yellow-400">
                            {Math.round(performanceMutation.data.data.metrics.domContentLoaded)}ms
                          </div>
                          <div className="text-sm text-gray-400">DOM Content Loaded</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-red-400">
                            {Math.round(performanceMutation.data.data.metrics.responseStart)}ms
                          </div>
                          <div className="text-sm text-gray-400">Response Start</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-indigo-400">
                            {Math.round(performanceMutation.data.data.metrics.responseEnd)}ms
                          </div>
                          <div className="text-sm text-gray-400">Response End</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Script Tab */}
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Custom Script Execution</CardTitle>
                <CardDescription>
                  Execute custom JavaScript on web pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-url">URL</Label>
                  <Input
                    id="custom-url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com"
                    data-testid="input-custom-url"
                  />
                </div>

                <div>
                  <Label htmlFor="custom-script">JavaScript Code</Label>
                  <Textarea
                    id="custom-script"
                    value={customScript}
                    onChange={(e) => setCustomScript(e.target.value)}
                    placeholder="return document.title;"
                    rows={10}
                    className="font-mono"
                    data-testid="textarea-custom-script"
                  />
                </div>

                <Button 
                  onClick={handleCustomScript} 
                  disabled={customScriptMutation.isPending}
                  data-testid="button-execute-script"
                >
                  {customScriptMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Execute Script
                </Button>

                {customScriptMutation.data?.data && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label>Script Result</Label>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm mt-2">
                        {JSON.stringify(customScriptMutation.data.data.result, null, 2)}
                      </pre>
                    </div>
                    
                    {customScriptMutation.data.data.screenshot && (
                      <div>
                        <Label>Page Screenshot</Label>
                        <img 
                          src={customScriptMutation.data.data.screenshot} 
                          alt="Script Result"
                          className="max-w-full h-auto border rounded-lg mt-2"
                          data-testid="img-custom-result"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batch Operations Tab */}
          <TabsContent value="batch">
            <Card>
              <CardHeader>
                <CardTitle>Batch Operations</CardTitle>
                <CardDescription>
                  Execute multiple automation tasks in sequence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Operations Queue</Label>
                  <p className="text-sm text-gray-400">
                    Configure multiple operations to run in batch mode
                  </p>
                </div>

                <Button 
                  onClick={handleBatchOperations} 
                  disabled={batchMutation.isPending}
                  data-testid="button-run-batch"
                >
                  {batchMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  Run Batch Operations
                </Button>

                {batchMutation.data && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Batch Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex gap-4">
                          <Badge variant="default">
                            {batchMutation.data.completed} Completed
                          </Badge>
                          <Badge variant="destructive">
                            {batchMutation.data.failed} Failed
                          </Badge>
                        </div>
                        <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
                          {JSON.stringify(batchMutation.data.results, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}