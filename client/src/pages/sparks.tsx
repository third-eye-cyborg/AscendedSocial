import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Sparks() {
  const [sparkInput, setSparkInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check camera permissions
  const checkCameraPermissions = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { hasPermission: false, error: "Camera not supported in this browser" };
      }

      // Check if we're on HTTPS
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        return { hasPermission: false, error: "Camera requires secure HTTPS connection" };
      }

      // Try to get permission status if available
      if (navigator.permissions) {
        try {
          const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          if (cameraPermission.state === 'denied') {
            return { hasPermission: false, error: "Camera access denied. Please enable in browser settings." };
          }
        } catch (e) {
          // Permission API might not be fully supported, continue with getUserMedia test
        }
      }

      return { hasPermission: true, error: null };
    } catch (error) {
      return { hasPermission: false, error: "Camera permission check failed" };
    }
  };

  // Fetch sparks
  const { data: sparks = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/sparks'],
    queryFn: () => fetch('/api/sparks').then(res => res.json())
  });

  // Create spark mutation
  const createSparkMutation = useMutation({
    mutationFn: async (data: { content: string; video?: File }) => {
      const formData = new FormData();
      formData.append('content', data.content);
      if (data.video) {
        formData.append('video', data.video);
      }

      const response = await fetch('/api/sparks', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create spark');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✨ Spark Created!",
        description: "Your spiritual insight has been shared.",
      });
      setSparkInput("");
      setRecordedVideo(null);
      setPreviewUrl(null);
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startRecording = async () => {
    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media recording not supported in this browser");
      }

      // Check if we're on HTTPS (required for camera access)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        throw new Error("Camera access requires HTTPS");
      }

      // Request camera and microphone access with fallback options
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 720, max: 1280 },
            height: { ideal: 1280, max: 1920 },
            aspectRatio: { ideal: 9/16 }
          },
          audio: true,
        });
      } catch (highQualityError) {
        // Fallback to lower quality if high quality fails
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: 480 },
              height: { ideal: 640 }
            },
            audio: true,
          });
        } catch (fallbackError) {
          // Final fallback - basic video only
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Determine best supported MIME type
      let mimeType = 'video/webm; codecs=vp8,opus';
      const supportedTypes = [
        'video/webm; codecs=vp9,opus',
        'video/webm; codecs=vp8,opus', 
        'video/webm',
        'video/mp4; codecs=avc1.42E01E,mp4a.40.2',
        'video/mp4'
      ];

      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const file = new File([blob], `spark-${Date.now()}.mp4`, { type: 'video/mp4' });
        setRecordedVideo(file);
        setPreviewUrl(URL.createObjectURL(blob));
        
        // Stop and clean up stream
        stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast({
          title: "Recording Error",
          description: "Failed to record video. Please try again.",
          variant: "destructive",
        });
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Tap the stop button when you're done recording.",
      });

    } catch (error: any) {
      console.error('Camera access error:', error);
      
      let errorMessage = "Could not access camera. ";
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += "Please allow camera permissions and try again.";
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage += "No camera found on this device.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage += "Camera not supported in this browser.";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage += "Camera is being used by another application.";
      } else if (error.message.includes('HTTPS')) {
        errorMessage += "Secure connection required for camera access.";
      } else {
        errorMessage += error.message || "Please check your camera settings.";
      }

      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearVideo = () => {
    setRecordedVideo(null);
    setPreviewUrl(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const handleCreateSpark = () => {
    if (!sparkInput.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content for your spark.",
        variant: "destructive",
      });
      return;
    }

    createSparkMutation.mutate({
      content: sparkInput.trim(),
      video: recordedVideo || undefined,
    });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
            <i className="fas fa-bolt text-primary text-3xl"></i>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">Sparks</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Quick spiritual insights, sudden inspirations, and divine downloads shared in micro-format.
          </p>
        </div>

        {/* Create Spark */}
        <Card className="bg-cosmic-light border border-primary/30 mb-8">
          <CardHeader>
            <CardTitle className="text-accent-light flex items-center">
              <i className="fas fa-plus-circle mr-2"></i>
              Share a Spark
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Recording Section */}
            {!recordedVideo && (
              <div className="space-y-3">
                {isRecording && (
                  <div className="relative aspect-[9/16] max-w-xs mx-auto bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      REC
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 justify-center">
                  {!isRecording ? (
                    <Button
                      onClick={async () => {
                        const { hasPermission, error } = await checkCameraPermissions();
                        if (!hasPermission) {
                          toast({
                            title: "Camera Access Issue",
                            description: error,
                            variant: "destructive",
                          });
                          return;
                        }
                        startRecording();
                      }}
                      variant="outline"
                      size="sm"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      data-testid="button-start-recording"
                    >
                      <i className="fas fa-video mr-2"></i>
                      Record Video
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white"
                      data-testid="button-stop-recording"
                    >
                      <i className="fas fa-stop mr-2"></i>
                      Stop Recording
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Video Preview */}
            {previewUrl && (
              <div className="space-y-3">
                <div className="relative aspect-[9/16] max-w-xs mx-auto bg-black rounded-lg overflow-hidden">
                  <video
                    src={previewUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                    data-testid="video-preview"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={clearVideo}
                    variant="outline"
                    size="sm"
                    className="border-red-400/30 text-red-400 hover:bg-red-400/10"
                    data-testid="button-clear-video"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Remove Video
                  </Button>
                </div>
              </div>
            )}

            {/* Text Input */}
            <div className="space-y-2">
              <Input
                placeholder="What spiritual insight just sparked in you? ⚡"
                value={sparkInput}
                onChange={(e) => setSparkInput(e.target.value)}
                className="bg-cosmic border-primary/30 text-white placeholder:text-gray-400"
                maxLength={140}
                data-testid="input-spark"
              />
              <p className="text-xs text-gray-400">
                {sparkInput.length}/140 characters - Keep it quick and divine!
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleCreateSpark}
                className="bg-primary hover:bg-primary/80 text-white px-8"
                disabled={!sparkInput.trim() || createSparkMutation.isPending}
                data-testid="button-create-spark"
              >
                {createSparkMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-bolt mr-2"></i>
                    Create Spark
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sparks Feed */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Sparks ⚡</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <i className="fas fa-spinner fa-spin text-primary text-2xl mb-4"></i>
              <p className="text-gray-400">Loading sparks...</p>
            </div>
          ) : sparks.length === 0 ? (
            <Card className="bg-cosmic-light border border-primary/30">
              <CardContent className="p-8 text-center">
                <i className="fas fa-bolt text-primary text-4xl mb-4"></i>
                <h3 className="text-xl font-semibold text-white mb-2">No Sparks Yet</h3>
                <p className="text-gray-400">Be the first to share a spiritual spark!</p>
              </CardContent>
            </Card>
          ) : (
            sparks.map((spark: any) => (
              <Card key={spark.id} className="bg-cosmic-light border border-primary/30 hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {spark.author.profileImageUrl ? (
                        <img 
                          src={spark.author.profileImageUrl} 
                          alt={spark.author.username || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/30 flex items-center justify-center">
                          <i className="fas fa-user text-white text-sm"></i>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Video (if present) */}
                      {spark.videoStreamUrls && (
                        <div className="mb-3">
                          <div className="relative aspect-[9/16] max-w-xs bg-black rounded-lg overflow-hidden">
                            <video
                              src={spark.videoStreamUrls.hls}
                              poster={spark.videoStreamUrls.thumbnail}
                              controls
                              playsInline
                              className="w-full h-full object-cover"
                              data-testid={`spark-video-${spark.id}`}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Content */}
                      <p className="text-white mb-3 break-words">{spark.content}</p>
                      
                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-2">
                          <span>@{spark.author.username || 'Anonymous'}</span>
                          <span>•</span>
                          <span>{new Date(spark.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="capitalize text-primary">{spark.chakra}</span>
                        </div>
                        
                        {/* Engagement counts */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-primary">
                            <i className="fas fa-bolt"></i>
                            <span>{spark.energy || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-green-400">
                            <i className="fas fa-thumbs-up"></i>
                            <span>{spark.upvotes || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-red-400">
                            <i className="fas fa-thumbs-down"></i>
                            <span>{spark.downvotes || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
}