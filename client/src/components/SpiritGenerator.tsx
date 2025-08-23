import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SpiritAvatar from "@/components/SpiritAvatar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Wand2, RefreshCw } from "lucide-react";

export default function SpiritGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionnaire, setQuestionnaire] = useState({
    isReligious: false,
    isSpiritual: true,
    religion: "",
    spiritualPath: "",
    beliefs: "",
    offerings: "",
    astrologySign: ""
  });

  // Get current spirit
  const { data: currentSpirit } = useQuery({
    queryKey: ["/api/spirit"],
    enabled: !!user,
  });

  const generateSpiritMutation = useMutation({
    mutationFn: async (questionnaireData: typeof questionnaire) => {
      return apiRequest("POST", "/api/spirit/generate", questionnaireData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spirit"] });
      setIsModalOpen(false);
      toast({
        title: "✨ Spirit Generated!",
        description: "Your new AI spiritual companion has been created",
      });
      // Reset form
      setQuestionnaire({
        isReligious: false,
        isSpiritual: true,
        religion: "",
        spiritualPath: "",
        beliefs: "",
        offerings: "",
        astrologySign: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const regenerateSpiritMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/spirit/regenerate");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/spirit"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }); // Refresh user data for energy
      toast({
        title: "✨ Spirit Evolved!",
        description: "Your spiritual companion has evolved into a new form",
      });
    },
    onError: (error) => {
      toast({
        title: "Evolution Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateSpirit = () => {
    if (!questionnaire.beliefs || !questionnaire.astrologySign) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in your beliefs and astrology sign",
        variant: "destructive",
      });
      return;
    }
    generateSpiritMutation.mutate(questionnaire);
  };

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  return (
    <div className="space-y-3">
      {/* Current Spirit Display */}
      {currentSpirit ? (
        <Card className="bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 border-2 border-purple-500/30 shadow-xl overflow-hidden relative">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 via-transparent to-transparent opacity-50" />
          
          <CardContent className="p-6 relative z-10">
            {/* Spirit Avatar - Centered and Larger */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="mb-4 relative">
                {/* Glow effect behind avatar */}
                <div className="absolute inset-0 blur-xl bg-purple-500/30 rounded-full" />
                <SpiritAvatar userId={(user as any)?.id} size="lg" showDetails={false} />
              </div>
              
              {/* Spirit Name and Info */}
              <h3 className="text-xl font-bold text-white mb-2">
                {(currentSpirit as any)?.name || "Mystic Guide"}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm font-medium capitalize">
                  {(currentSpirit as any)?.element || "Unknown"}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium">
                  Level {(currentSpirit as any)?.level || 1}
                </span>
              </div>
            </div>
            
            {/* Description with better contrast */}
            <p className="text-sm text-gray-300 leading-relaxed mb-4 text-center italic">
              {(currentSpirit as any)?.description || "A wise spiritual companion on your journey of growth and discovery."}
            </p>
            
            {/* Experience Bar */}
            {(currentSpirit as any)?.experience !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Experience</span>
                  <span>{(currentSpirit as any)?.experience || 0} XP</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${((currentSpirit as any)?.experience % 100) || 0}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Energy Cost Display */}
            <div className="mb-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Evolution Cost: 100 Energy</p>
              <p className={`text-xs ${((user as any)?.energy || 0) >= 100 ? 'text-green-400' : 'text-red-400'}`}>
                Your Energy: {(user as any)?.energy || 0}
              </p>
              {((user as any)?.energy || 0) < 100 && (
                <p className="text-xs text-red-400 mt-1">Insufficient energy to evolve</p>
              )}
            </div>
            
            {/* Evolve Button - More Prominent */}
            <Button
              onClick={() => regenerateSpiritMutation.mutate()}
              disabled={regenerateSpiritMutation.isPending || ((user as any)?.energy || 0) < 100}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              size="default"
              data-testid="button-regenerate-spirit"
            >
              {regenerateSpiritMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Evolving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Evolve
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              data-testid="button-generate-spirit"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate AI Spirit
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-cosmic-light border border-primary/30 text-white max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-accent-light flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Your AI Spirit Guide
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isReligious"
                    checked={questionnaire.isReligious}
                    onChange={(e) => setQuestionnaire(prev => ({ ...prev, isReligious: e.target.checked }))}
                    className="rounded border-primary/30"
                    data-testid="checkbox-religious"
                  />
                  <Label htmlFor="isReligious" className="text-sm text-white">Religious</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isSpiritual"
                    checked={questionnaire.isSpiritual}
                    onChange={(e) => setQuestionnaire(prev => ({ ...prev, isSpiritual: e.target.checked }))}
                    className="rounded border-primary/30"
                    data-testid="checkbox-spiritual"
                  />
                  <Label htmlFor="isSpiritual" className="text-sm text-white">Spiritual</Label>
                </div>
              </div>

              {questionnaire.isReligious && (
                <div>
                  <Label htmlFor="religion" className="text-white text-sm">Religion</Label>
                  <Input
                    id="religion"
                    value={questionnaire.religion}
                    onChange={(e) => setQuestionnaire(prev => ({ ...prev, religion: e.target.value }))}
                    placeholder="Your religious background"
                    className="bg-cosmic border-primary/30 text-white"
                    data-testid="input-religion"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="spiritualPath" className="text-white text-sm">Spiritual Path</Label>
                <Input
                  id="spiritualPath"
                  value={questionnaire.spiritualPath}
                  onChange={(e) => setQuestionnaire(prev => ({ ...prev, spiritualPath: e.target.value }))}
                  placeholder="Your spiritual practice or path"
                  className="bg-cosmic border-primary/30 text-white"
                  data-testid="input-spiritual-path"
                />
              </div>

              <div>
                <Label htmlFor="beliefs" className="text-white text-sm">Core Beliefs *</Label>
                <Textarea
                  id="beliefs"
                  value={questionnaire.beliefs}
                  onChange={(e) => setQuestionnaire(prev => ({ ...prev, beliefs: e.target.value }))}
                  placeholder="Share your core spiritual beliefs and values..."
                  className="bg-cosmic border-primary/30 text-white min-h-[60px]"
                  data-testid="textarea-beliefs"
                />
              </div>

              <div>
                <Label htmlFor="offerings" className="text-white text-sm">Sacred Offerings</Label>
                <Input
                  id="offerings"
                  value={questionnaire.offerings}
                  onChange={(e) => setQuestionnaire(prev => ({ ...prev, offerings: e.target.value }))}
                  placeholder="What do you offer to the divine?"
                  className="bg-cosmic border-primary/30 text-white"
                  data-testid="input-offerings"
                />
              </div>

              <div>
                <Label htmlFor="astrologySign" className="text-white text-sm">Astrology Sign *</Label>
                <Select 
                  value={questionnaire.astrologySign} 
                  onValueChange={(value) => setQuestionnaire(prev => ({ ...prev, astrologySign: value }))}
                >
                  <SelectTrigger className="bg-cosmic border-primary/30 text-white" data-testid="select-astrology">
                    <SelectValue placeholder="Select your zodiac sign" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-light border-primary/30">
                    {zodiacSigns.map((sign) => (
                      <SelectItem key={sign} value={sign} className="text-white hover:bg-primary/20">
                        {sign}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border-primary/50 text-white hover:bg-cosmic"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateSpirit}
                  disabled={generateSpiritMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  data-testid="button-submit-generate"
                >
                  {generateSpiritMutation.isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Spirit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}