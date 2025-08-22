import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Sparks() {
  const [sparkInput, setSparkInput] = useState("");

  const handleCreateSpark = () => {
    if (sparkInput.trim()) {
      alert(`✨ Spark Created! ✨\n\n"${sparkInput}"\n\nThis feature will be fully implemented soon!`);
      setSparkInput("");
    }
  };

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
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="What spiritual insight just sparked in you? ⚡"
                value={sparkInput}
                onChange={(e) => setSparkInput(e.target.value)}
                className="flex-1 bg-cosmic border-primary/30 text-white placeholder:text-gray-400"
                maxLength={140}
                data-testid="input-spark"
              />
              <Button 
                onClick={handleCreateSpark}
                className="bg-primary hover:bg-primary/80"
                disabled={!sparkInput.trim()}
                data-testid="button-create-spark"
              >
                <i className="fas fa-bolt mr-2"></i>
                Spark
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {sparkInput.length}/140 characters - Keep it quick and divine!
            </p>
          </CardContent>
        </Card>

        {/* Example Sparks */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Sparks ⚡</h2>
          
          {[
            {
              content: "The universe doesn't give you what you want, it gives you what you ARE. ✨",
              user: "SoulSeeker",
              time: "2 minutes ago",
              sparks: 12
            },
            {
              content: "Every breath is a prayer, every heartbeat a sacred rhythm. 🙏",
              user: "MysticHeart",
              time: "5 minutes ago",
              sparks: 8
            },
            {
              content: "Today I realized: resistance creates suffering, acceptance creates peace.",
              user: "ZenWalker",
              time: "12 minutes ago",
              sparks: 15
            }
          ].map((spark, index) => (
            <Card key={index} className="bg-cosmic-light border border-primary/30 hover-lift">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary/30 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-xs text-white"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-white mb-2">{spark.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>@{spark.user} • {spark.time}</span>
                      <div className="flex items-center space-x-1 text-primary">
                        <i className="fas fa-bolt"></i>
                        <span>{spark.sparks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="bg-cosmic-light border border-primary/30 max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                ⚡ Feature In Development
              </h3>
              <p className="text-gray-300 mb-4">
                Sparks will be a micro-blogging platform for quick spiritual insights and divine downloads. 
                Share your sudden inspirations in 140 characters or less!
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-primary hover:bg-primary/80"
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