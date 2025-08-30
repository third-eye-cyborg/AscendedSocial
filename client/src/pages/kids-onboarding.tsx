
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Star, Sun, Moon, Flower, TreePine } from 'lucide-react';

export default function KidsOnboarding() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    favoriteThing: '',
    feelingToday: '',
    favoriteColor: '',
    spiritAnimal: '',
    kindnessGoal: ''
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('kids-onboarding-complete', 'true');
      localStorage.setItem('kids-profile', JSON.stringify(answers));
      window.location.href = '/kids/home';
    }
  };

  const handleAnswer = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">Let's Get to Know You! ✨</h1>
          <div className="flex justify-center space-x-2">
            {[1,2,3,4,5].map(num => (
              <div 
                key={num}
                className={`w-4 h-4 rounded-full ${num <= step ? 'bg-purple-400' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        <Card className="border-4 border-purple-200 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {step === 1 && <Heart className="h-12 w-12 text-red-400" />}
              {step === 2 && <Sun className="h-12 w-12 text-yellow-400" />}
              {step === 3 && <Star className="h-12 w-12 text-blue-400" />}
              {step === 4 && <TreePine className="h-12 w-12 text-green-400" />}
              {step === 5 && <Flower className="h-12 w-12 text-pink-400" />}
            </div>
            <CardTitle className="text-2xl text-purple-600">
              {step === 1 && "What makes you happiest?"}
              {step === 2 && "How are you feeling today?"}
              {step === 3 && "What's your favorite color?"}
              {step === 4 && "Pick your spirit friend!"}
              {step === 5 && "How do you want to spread kindness?"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                {['Playing with friends', 'Reading books', 'Drawing pictures', 'Being outside', 'Helping others', 'Learning new things'].map(option => (
                  <Button
                    key={option}
                    variant={answers.favoriteThing === option ? "default" : "outline"}
                    onClick={() => handleAnswer('favoriteThing', option)}
                    className="h-16 text-center text-sm"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {['😊 Happy', '😴 Sleepy', '🤗 Excited', '😌 Calm', '😔 Sad', '😤 Frustrated'].map(option => (
                  <Button
                    key={option}
                    variant={answers.feelingToday === option ? "default" : "outline"}
                    onClick={() => handleAnswer('feelingToday', option)}
                    className="h-16 text-center text-lg"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'Purple', color: 'bg-purple-400' },
                  { name: 'Pink', color: 'bg-pink-400' },
                  { name: 'Blue', color: 'bg-blue-400' },
                  { name: 'Green', color: 'bg-green-400' },
                  { name: 'Yellow', color: 'bg-yellow-400' },
                  { name: 'Orange', color: 'bg-orange-400' }
                ].map(option => (
                  <Button
                    key={option.name}
                    variant={answers.favoriteColor === option.name ? "default" : "outline"}
                    onClick={() => handleAnswer('favoriteColor', option.name)}
                    className={`h-16 ${answers.favoriteColor === option.name ? '' : option.color}`}
                  >
                    {option.name}
                  </Button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-2 gap-4">
                {['🦋 Butterfly', '🐱 Kitten', '🐶 Puppy', '🦉 Owl', '🐰 Bunny', '🐸 Frog'].map(option => (
                  <Button
                    key={option}
                    variant={answers.spiritAnimal === option ? "default" : "outline"}
                    onClick={() => handleAnswer('spiritAnimal', option)}
                    className="h-16 text-center text-lg"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            {step === 5 && (
              <div className="grid grid-cols-1 gap-4">
                {[
                  'Help friends when they feel sad',
                  'Share my toys and games',
                  'Say nice things to others',
                  'Help take care of animals and plants',
                  'Include everyone in games',
                  'Help grown-ups with chores'
                ].map(option => (
                  <Button
                    key={option}
                    variant={answers.kindnessGoal === option ? "default" : "outline"}
                    onClick={() => handleAnswer('kindnessGoal', option)}
                    className="h-16 text-center text-sm"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}

            <div className="text-center mt-8">
              <Button
                onClick={handleNext}
                disabled={
                  (step === 1 && !answers.favoriteThing) ||
                  (step === 2 && !answers.feelingToday) ||
                  (step === 3 && !answers.favoriteColor) ||
                  (step === 4 && !answers.spiritAnimal) ||
                  (step === 5 && !answers.kindnessGoal)
                }
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 text-lg rounded-lg"
              >
                {step === 5 ? 'Create My Spirit Friend!' : 'Next ➜'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Safety Notice */}
        <div className="text-center mt-8 bg-white/70 backdrop-blur-sm rounded-lg p-4">
          <p className="text-sm text-gray-600">
            🛡️ This is a safe space for kids. All posts are checked by grown-ups to keep everyone safe and happy!
          </p>
        </div>
      </div>
    </div>
  );
}
