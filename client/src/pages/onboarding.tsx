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
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Welcome to Ascended Social
          </h1>
          <p className="text-lg text-muted">
            A spiritual social platform where AI serves as divine guidance
          </p>
          <div className="flex justify-center mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full mx-1 ${
                  i <= step ? 'bg-primary' : 'bg-cosmic'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="bg-cosmic-light border border-primary/30">
          <CardHeader>
            <CardTitle className="text-accent-light">
              {step === 1 && "✨ Your Spiritual Identity"}
              {step === 2 && "🔮 Your Beliefs & Path"}
              {step === 3 && "🌟 Your Cosmic Profile"}
              {step === 4 && "🚀 Complete Your Journey"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="bg-cosmic/50 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">Understanding AI Divination</h3>
                  <p className="text-white/90 mb-4">
                    Ascended Social uses artificial intelligence as a form of modern divination - 
                    reading patterns in vast datasets to provide spiritual insights and guidance.
                  </p>
                  <p className="text-white/90 mb-4">
                    Like any divination tool, AI can be used for good or ill. We believe in using
                    technology to enhance spiritual growth, self-reflection, and authentic connection.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-primary">
                    <span>🔮 Personal Reflection</span>
                    <span>🌟 Spiritual Growth</span>
                    <span>✨ Authentic Connection</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="spiritual"
                      checked={formData.isSpiritual}
                      onCheckedChange={(checked) => updateFormData({ isSpiritual: !!checked })}
                    />
                    <Label htmlFor="spiritual" className="text-white">
                      I consider myself spiritual
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="religious"
                      checked={formData.isReligious}
                      onCheckedChange={(checked) => updateFormData({ isReligious: !!checked })}
                    />
                    <Label htmlFor="religious" className="text-white">
                      I follow a specific religion
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {formData.isReligious && (
                  <div>
                    <Label className="text-white">What is your religion?</Label>
                    <Input
                      value={formData.religion}
                      onChange={(e) => updateFormData({ religion: e.target.value })}
                      placeholder="e.g., Christianity, Islam, Buddhism..."
                      className="bg-cosmic border-primary/30 text-white mt-2"
                    />
                  </div>
                )}
                
                {formData.isSpiritual && (
                  <div>
                    <Label className="text-white">What spiritual path do you follow?</Label>
                    <Input
                      value={formData.spiritualPath}
                      onChange={(e) => updateFormData({ spiritualPath: e.target.value })}
                      placeholder="e.g., Meditation, Witchcraft, New Age..."
                      className="bg-cosmic border-primary/30 text-white mt-2"
                    />
                  </div>
                )}
                
                <div>
                  <Label className="text-white">Describe your spiritual beliefs</Label>
                  <Textarea
                    value={formData.beliefs}
                    onChange={(e) => updateFormData({ beliefs: e.target.value })}
                    placeholder="Share what guides your spiritual journey..."
                    className="bg-cosmic border-primary/30 text-white mt-2 min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label className="text-white">What do you offer to the spiritual community?</Label>
                  <Textarea
                    value={formData.offerings}
                    onChange={(e) => updateFormData({ offerings: e.target.value })}
                    placeholder="Your gifts, wisdom, or talents you wish to share..."
                    className="bg-cosmic border-primary/30 text-white mt-2 min-h-[100px]"
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

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="border-primary/50 text-white hover:bg-cosmic"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={completeOnboardingMutation.isPending}
                className="bg-primary hover:bg-primary/80"
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
                  "Next"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}