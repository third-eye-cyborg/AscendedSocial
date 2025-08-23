import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SigilGeneratorProps {
  onSigilGenerated?: (sigil: string) => void;
}

export default function SigilGenerator({ onSigilGenerated }: SigilGeneratorProps) {
  const [generatedSigil, setGeneratedSigil] = useState<string>("");
  const [generatedSigilImage, setGeneratedSigilImage] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get user data for energy display and saved sigil
  const { data: user } = useQuery({ queryKey: ["/api/auth/user"] });
  
  // Show saved sigil if no new one is generated
  const displaySigil = generatedSigil || user?.sigil;
  const displaySigilImage = generatedSigilImage || user?.sigilImageUrl;
  const isGeneratedSigil = !!generatedSigil;
  
  // Always prioritize showing the image if it exists
  const shouldShowImage = displaySigilImage && displaySigilImage.trim() !== '';

  const generateSigilMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/generate-sigil");
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setGeneratedSigil(data.sigil);
      setGeneratedSigilImage(data.sigilImageUrl || "");
      onSigilGenerated?.(data.sigil);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] }); // Refresh user data for energy
      toast({
        title: "Sigil Generated",
        description: "Your unique spiritual sigil has been created",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const saveSigilMutation = useMutation({
    mutationFn: async (data: { sigil: string; imageUrl: string }) => {
      return apiRequest("PUT", "/api/save-sigil", data);
    },
    onSuccess: async () => {
      // Clear generated sigil to show saved one
      setGeneratedSigil("");
      setGeneratedSigilImage("");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Sigil Saved",
        description: "Your spiritual sigil has been saved to your profile",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="bg-slate-900 border border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-accent-light flex items-center">
          <i className="fas fa-magic mr-2"></i>
          Sigil Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displaySigil ? (
          <div className="text-center">
            <div className="sigil-container w-24 h-24 mx-auto rounded-full p-1 mb-4">
              {shouldShowImage ? (
                <img 
                  src={displaySigilImage}
                  alt={isGeneratedSigil ? "Generated Sigil" : "Your Saved Sigil"}
                  className="w-full h-full object-cover rounded-full"
                  data-testid={isGeneratedSigil ? "img-generated-sigil" : "img-saved-sigil"}
                  onError={() => {
                    if (isGeneratedSigil) {
                      setGeneratedSigilImage("");
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-cosmic rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-mono" data-testid={isGeneratedSigil ? "text-generated-sigil" : "text-saved-sigil"}>
                    {displaySigil}
                  </span>
                </div>
              )}
            </div>
            
            {/* Energy Pattern Display - Show text sigil below AI image */}
            {shouldShowImage && displaySigil && (
              <div className="mb-4">
                <p className="text-xs text-primary/80 mb-2 font-medium">Energy Pattern</p>
                <div className="bg-cosmic-light/50 rounded-lg p-3 border border-primary/20 mx-auto max-w-[200px]">
                  <pre className="text-xs text-primary/90 leading-tight font-mono whitespace-pre-wrap text-center">
                    {displaySigil}
                  </pre>
                </div>
              </div>
            )}
            
            <p className="text-sm text-white/90 mb-4">
              {isGeneratedSigil ? "Your unique spiritual signature has been generated. This sigil represents your energy and essence." : "This is your saved spiritual sigil. It represents your energy and essence."}
            </p>
            <div className="flex flex-col space-y-2">
              {isGeneratedSigil && (
                <Button
                  onClick={() => saveSigilMutation.mutate({ sigil: generatedSigil, imageUrl: generatedSigilImage })}
                  disabled={saveSigilMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-save-sigil"
                >
                  {saveSigilMutation.isPending ? "Saving..." : "Save Sigil"}
                </Button>
              )}
              <div className="space-y-2">
                {/* Energy Cost Display for regeneration */}
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-1">Generation Cost: 100 Energy</p>
                  <p className={`text-xs ${((user as any)?.energy || 0) >= 100 ? 'text-green-400' : 'text-red-400'}`}>
                    Your Energy: {(user as any)?.energy || 0}
                  </p>
                  {((user as any)?.energy || 0) < 100 && (
                    <p className="text-xs text-red-400 mt-1">Insufficient energy to generate</p>
                  )}
                </div>
                <Button
                  onClick={() => generateSigilMutation.mutate()}
                  disabled={generateSigilMutation.isPending || ((user as any)?.energy || 0) < 100}
                  variant="outline"
                  className="bg-transparent border-primary/30 text-white hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-regenerate"
                >
                  {generateSigilMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-cosmic border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    isGeneratedSigil ? "Generate New Sigil" : "Generate Different Sigil"
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto bg-cosmic/50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-primary/30">
              <i className="fas fa-magic text-primary text-2xl"></i>
            </div>
            <p className="text-sm text-gray-300 mb-2">
              Generate your unique AI-powered spiritual sigil
            </p>
            {/* Energy Cost Display */}
            <div className="mb-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Generation Cost: 100 Energy</p>
              <p className={`text-xs ${((user as any)?.energy || 0) >= 100 ? 'text-green-400' : 'text-red-400'}`}>
                Your Energy: {(user as any)?.energy || 0}
              </p>
              {((user as any)?.energy || 0) < 100 && (
                <p className="text-xs text-red-400 mt-1">Insufficient energy to generate</p>
              )}
            </div>
            <Button
              onClick={() => generateSigilMutation.mutate()}
              disabled={generateSigilMutation.isPending || ((user as any)?.energy || 0) < 100}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-generate"
            >
              {generateSigilMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-cosmic border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                "Generate Sigil"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
