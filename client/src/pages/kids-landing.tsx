
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Heart, Star, Rainbow, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function KidsLanding() {
  const [age, setAge] = useState('');

  const handleGetStarted = () => {
    const userAge = parseInt(age);
    if (userAge < 6 || userAge > 17) {
      alert('This app is designed for children ages 6-17. Please ask a parent or guardian for help!');
      return;
    }
    window.location.href = '/kids/onboarding';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ascended Kids
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-12 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center space-x-4 mb-8">
            <Star className="h-12 w-12 text-yellow-400 animate-pulse" />
            <Heart className="h-12 w-12 text-red-400 animate-bounce" />
            <Rainbow className="h-12 w-12 text-purple-400 animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Ascended Kids!
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            A safe, magical place for young explorers to share kindness, 
            learn about emotions, and grow their beautiful hearts! 🌟
          </p>

          {/* Age Verification */}
          <Card className="max-w-md mx-auto mb-8 border-4 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-600 flex items-center justify-center gap-2">
                <Sun className="h-5 w-5" />
                How old are you?
              </CardTitle>
              <CardDescription>
                This helps us make sure everything is just right for you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <select 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-purple-200 text-lg"
                >
                  <option value="">Pick your age...</option>
                  {Array.from({length: 12}, (_, i) => i + 6).map(ageNum => (
                    <option key={ageNum} value={ageNum}>{ageNum} years old</option>
                  ))}
                </select>
                
                <Button 
                  onClick={handleGetStarted}
                  disabled={!age}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 text-lg rounded-lg"
                >
                  Start My Adventure! ✨
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features for Kids */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <Heart className="h-8 w-8 text-red-400 mx-auto" />
                <CardTitle className="text-red-600">Share Kindness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Share your happy thoughts and spread kindness to friends around the world!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <Star className="h-8 w-8 text-blue-400 mx-auto" />
                <CardTitle className="text-blue-600">Grow Your Heart</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Learn about feelings and emotions with your magical spirit guide friend!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <Rainbow className="h-8 w-8 text-green-400 mx-auto" />
                <CardTitle className="text-green-600">Make Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Connect with other kind kids and learn together in a safe space!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Parent Notice */}
      <section className="bg-white border-t-4 border-purple-200 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Moon className="h-8 w-8 text-purple-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-purple-600 mb-4">For Parents & Guardians</h3>
          <p className="text-gray-700 text-lg mb-6">
            Ascended Kids is designed with the highest safety standards. All content is moderated, 
            personal information is protected, and we comply with COPPA regulations.
          </p>
          <Button 
            variant="outline" 
            className="border-purple-200 text-purple-600 hover:bg-purple-50"
            onClick={() => window.location.href = '/kids/parent-info'}
          >
            Learn More About Safety
          </Button>
        </div>
      </section>
    </div>
  );
}
