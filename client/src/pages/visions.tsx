import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Visions() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
            <i className="fas fa-video text-primary text-3xl"></i>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-4">Visions</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Share and discover mystical video content, spiritual visions, and sacred teachings through moving imagery.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-cosmic-light border border-primary/30 hover-lift">
            <CardHeader>
              <CardTitle className="text-accent-light flex items-center">
                <i className="fas fa-play-circle mr-2"></i>
                Video Meditations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Guided meditations and spiritual practices in video form.
              </p>
              <div className="aspect-video bg-cosmic rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-om text-primary text-4xl"></i>
              </div>
              <Button className="w-full bg-primary/30 hover:bg-primary/50 text-white">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-cosmic-light border border-primary/30 hover-lift">
            <CardHeader>
              <CardTitle className="text-accent-light flex items-center">
                <i className="fas fa-eye mr-2"></i>
                Mystical Visions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Share your spiritual visions and mystical experiences through video.
              </p>
              <div className="aspect-video bg-cosmic rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-eye text-primary text-4xl"></i>
              </div>
              <Button className="w-full bg-primary/30 hover:bg-primary/50 text-white">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-cosmic-light border border-primary/30 hover-lift">
            <CardHeader>
              <CardTitle className="text-accent-light flex items-center">
                <i className="fas fa-chalkboard-teacher mr-2"></i>
                Sacred Teachings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Educational content from spiritual teachers and wisdom keepers.
              </p>
              <div className="aspect-video bg-cosmic rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-scroll text-primary text-4xl"></i>
              </div>
              <Button className="w-full bg-primary/30 hover:bg-primary/50 text-white">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Card className="bg-cosmic-light border border-primary/30 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                📹 Feature In Development
              </h3>
              <p className="text-gray-300 mb-4">
                The Visions platform is being crafted to share mystical video content, 
                guided meditations, and spiritual teachings. Stay tuned for this sacred feature!
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-primary hover:bg-primary/80 text-white"
              >
                Return to Feed
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}