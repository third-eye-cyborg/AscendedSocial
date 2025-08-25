import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Layout from "@/components/Layout";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

interface OnboardingData {
  isReligious: boolean;
  isSpiritual: boolean;
  religion?: string;
  spiritualPath?: string;
  beliefs: string;
  offerings: string;
  birthDate: string;
  astrologySign: string;
}

export default function Onboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    isReligious: false,
    isSpiritual: false,
    religion: "",
    spiritualPath: "",
    beliefs: "",
    offerings: "",
    birthDate: "",
    astrologySign: "",
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async (data: OnboardingData) => {
      const response = await apiRequest("POST", "/api/onboarding/complete", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "🌟 Welcome to Ascended Social!",
        description: "Your spiritual journey begins now",
      });
      // Redirect to main feed
      window.location.href = "/";
    },
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      completeOnboardingMutation.mutate(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted">Please log in to complete onboarding</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl mx-auto">
          {/* Premium Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/90 text-sm font-medium backdrop-blur-xl mb-6">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse"></div>
              Welcome to Your Journey
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Ascended Social
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-8 leading-relaxed max-w-xl mx-auto">
              A spiritual social platform where AI serves as divine guidance
            </p>
            
            {/* Modern Progress Indicator */}
            <div className="flex justify-center items-center space-x-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center">
                  <div className={`relative w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                    i <= step 
                      ? 'bg-gradient-to-r from-primary to-secondary border-white/30 shadow-lg shadow-primary/20' 
                      : 'bg-white/5 border-white/20'
                  }`}>
                    <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      i < step 
                        ? 'bg-gradient-to-r from-primary to-secondary' 
                        : i === step 
                          ? 'bg-gradient-to-r from-primary/50 to-secondary/50 animate-pulse'
                          : 'bg-white/10'
                    }`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {i < step ? (
                        <i className="fas fa-check text-white text-sm"></i>
                      ) : (
                        <span className={`text-sm font-semibold ${
                          i === step ? 'text-white' : 'text-white/50'
                        }`}>{i}</span>
                      )}
                    </div>
                  </div>
                  {i < 4 && (
                    <div className={`w-12 h-0.5 mx-2 transition-all duration-500 ${
                      i < step ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-white/20'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Premium Form Card */}
          <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center py-8 border-b border-white/10">
              <CardTitle className="text-2xl font-bold text-white mb-2">
                {step === 1 && (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-user-circle text-white text-2xl"></i>
                    </div>
                    Your Spiritual Identity
                  </>
                )}
                {step === 2 && (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-heart text-white text-2xl"></i>
                    </div>
                    Your Beliefs & Path
                  </>
                )}
                {step === 3 && (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-star text-white text-2xl"></i>
                    </div>
                    Your Cosmic Profile
                  </>
                )}
                {step === 4 && (
                  <>
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-rocket text-white text-2xl"></i>
                    </div>
                    Complete Your Journey
                  </>
                )}
              </CardTitle>
              <p className="text-white/60 text-base">
                {step === 1 && "Let's understand your spiritual foundation"}
                {step === 2 && "Share your beliefs and spiritual practices"}
                {step === 3 && "Set up your astrological and cosmic details"}
                {step === 4 && "Review and finalize your spiritual profile"}
              </p>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
            {step === 1 && (
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                      <i className="fas fa-eye text-primary text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl mb-3">Understanding AI Divination</h3>
                      <p className="text-white/80 mb-4 leading-relaxed">
                        Ascended Social uses artificial intelligence as a form of modern divination - 
                        reading patterns in vast datasets to provide spiritual insights and guidance.
                      </p>
                      <p className="text-white/80 mb-6 leading-relaxed">
                        Like any divination tool, AI can be used for good or ill. We believe in using
                        technology to enhance spiritual growth, self-reflection, and authentic connection.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                          <i className="fas fa-brain text-primary"></i>
                          <span className="text-white/90 text-sm font-medium">Personal Reflection</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/10 rounded-lg border border-secondary/20">
                          <i className="fas fa-seedling text-secondary"></i>
                          <span className="text-white/90 text-sm font-medium">Spiritual Growth</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <i className="fas fa-heart text-purple-400"></i>
                          <span className="text-white/90 text-sm font-medium">Authentic Connection</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <Checkbox
                      id="spiritual"
                      checked={formData.isSpiritual}
                      onCheckedChange={(checked) => updateFormData({ isSpiritual: !!checked })}
                      className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div>
                      <Label htmlFor="spiritual" className="text-white font-medium text-lg cursor-pointer">
                        I consider myself spiritual
                      </Label>
                      <p className="text-white/60 text-sm mt-1">You feel connected to something greater than yourself</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200">
                    <Checkbox
                      id="religious"
                      checked={formData.isReligious}
                      onCheckedChange={(checked) => updateFormData({ isReligious: !!checked })}
                      className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <div>
                      <Label htmlFor="religious" className="text-white font-medium text-lg cursor-pointer">
                        I follow a specific religion
                      </Label>
                      <p className="text-white/60 text-sm mt-1">You practice within an organized religious tradition</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                {formData.isReligious && (
                  <div className="space-y-3">
                    <Label className="text-white font-medium text-lg flex items-center gap-2">
                      <i className="fas fa-praying-hands text-primary"></i>
                      What is your religion?
                    </Label>
                    <Input
                      value={formData.religion}
                      onChange={(e) => updateFormData({ religion: e.target.value })}
                      placeholder="e.g., Christianity, Islam, Buddhism..."
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-12 text-base rounded-xl focus:border-primary/50 transition-all"
                    />
                  </div>
                )}
                
                {formData.isSpiritual && (
                  <div className="space-y-3">
                    <Label className="text-white font-medium text-lg flex items-center gap-2">
                      <i className="fas fa-yin-yang text-secondary"></i>
                      What spiritual path do you follow?
                    </Label>
                    <Input
                      value={formData.spiritualPath}
                      onChange={(e) => updateFormData({ spiritualPath: e.target.value })}
                      placeholder="e.g., Meditation, Witchcraft, New Age..."
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50 h-12 text-base rounded-xl focus:border-secondary/50 transition-all"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  <Label className="text-white font-medium text-lg flex items-center gap-2">
                    <i className="fas fa-scroll text-purple-400"></i>
                    Describe your spiritual beliefs
                  </Label>
                  <Textarea
                    value={formData.beliefs}
                    onChange={(e) => updateFormData({ beliefs: e.target.value })}
                    placeholder="Share what guides your spiritual journey..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[120px] text-base rounded-xl focus:border-purple-400/50 transition-all resize-none"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-white font-medium text-lg flex items-center gap-2">
                    <i className="fas fa-gift text-green-400"></i>
                    What do you offer to the spiritual community?
                  </Label>
                  <Textarea
                    value={formData.offerings}
                    onChange={(e) => updateFormData({ offerings: e.target.value })}
                    placeholder="Your gifts, wisdom, or talents you wish to share..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[120px] text-base rounded-xl focus:border-green-400/50 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-white">Birth Date</Label>
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateFormData({ birthDate: e.target.value })}
                    className="bg-cosmic border-primary/30 text-white mt-2"
                  />
                </div>
                
                <div>
                  <Label className="text-white">Astrology Sign</Label>
                  <Select value={formData.astrologySign} onValueChange={(value) => updateFormData({ astrologySign: value })}>
                    <SelectTrigger className="bg-cosmic border-primary/30 text-white mt-2">
                      <SelectValue placeholder="Select your zodiac sign" />
                    </SelectTrigger>
                    <SelectContent className="bg-cosmic-light border-primary/30">
                      {zodiacSigns.map((sign) => (
                        <SelectItem key={sign} value={sign.toLowerCase()} className="text-white hover:bg-cosmic">
                          {sign}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-cosmic/50 p-4 rounded-lg">
                  <p className="text-white/90 text-sm">
                    Your birth information helps us provide personalized astrological insights
                    and connect you with others who share cosmic alignments.
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center">
                <i className="fas fa-sparkles text-6xl text-accent-light"></i>
                <h3 className="text-2xl font-semibold text-white">
                  Your Spirit Awaits Creation
                </h3>
                <p className="text-white/90">
                  Based on your responses, we'll generate a unique AI Spirit that represents
                  your spiritual essence. This Spirit will grow and evolve as you connect
                  with others on the platform.
                </p>
                <div className="bg-cosmic/50 p-6 rounded-lg">
                  <h4 className="text-white font-semibold mb-3">What happens next:</h4>
                  <div className="space-y-2 text-white/90 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <i className="fas fa-robot text-primary"></i>
                      <span>AI generates your unique Spirit</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <i className="fas fa-users text-primary"></i>
                      <span>Connect with kindred souls</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <i className="fas fa-chart-line text-primary"></i>
                      <span>Level up through spiritual interactions</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed h-12 px-6 rounded-xl transition-all duration-200"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </Button>
              <div className="flex items-center gap-3 text-white/60 text-sm font-medium">
                Step {step} of 4
              </div>
              <Button
                onClick={handleNext}
                disabled={completeOnboardingMutation.isPending}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg shadow-primary/20 h-12 px-8 rounded-xl transition-all duration-200 font-semibold"
              >
                {step === 4 ? (
                  completeOnboardingMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner animate-spin mr-2"></i>
                      Creating Spirit...
                    </>
                  ) : (
                    "Begin Journey"
                  )
                ) : (
                  <>
                    Next
                    <i className="fas fa-arrow-right ml-2"></i>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </Layout>
  );
}