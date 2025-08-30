
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Star, Smile, Send, Image } from 'lucide-react';

interface KidsPost {
  id: string;
  content: string;
  author: {
    username: string;
    spiritAnimal: string;
    age: number;
  };
  hearts: number;
  stars: number;
  isApproved: boolean;
  createdAt: string;
}

export default function KidsHome() {
  const [posts, setPosts] = useState<KidsPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Load user profile from onboarding
    const profile = localStorage.getItem('kids-profile');
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }

    // Mock data for demonstration
    setPosts([
      {
        id: '1',
        content: 'I helped my little sister tie her shoes today! It made me feel really happy! 👟💝',
        author: { username: 'KindnessKid', spiritAnimal: '🦋 Butterfly', age: 8 },
        hearts: 12,
        stars: 5,
        isApproved: true,
        createdAt: '2025-01-30T10:00:00Z'
      },
      {
        id: '2',
        content: 'I drew a picture of my family and gave it to my mom. She smiled so big! 🎨👨‍👩‍👧',
        author: { username: 'ArtistAnnie', spiritAnimal: '🐱 Kitten', age: 10 },
        hearts: 8,
        stars: 3,
        isApproved: true,
        createdAt: '2025-01-30T09:30:00Z'
      }
    ]);
  }, []);

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    // In real implementation, this would go through moderation
    const post: KidsPost = {
      id: Date.now().toString(),
      content: newPost,
      author: {
        username: 'You',
        spiritAnimal: userProfile?.spiritAnimal || '⭐ Star',
        age: 0
      },
      hearts: 0,
      stars: 0,
      isApproved: false, // Needs moderation
      createdAt: new Date().toISOString()
    };

    setPosts(prev => [post, ...prev]);
    setNewPost('');
    
    // Show moderation message
    alert('Great post! A grown-up will check it to make sure it\'s safe, then everyone can see it! 🌟');
  };

  const handleEngagement = (postId: string, type: 'heart' | 'star') => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, [type === 'heart' ? 'hearts' : 'stars']: post[type === 'heart' ? 'hearts' : 'stars'] + 1 }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b-4 border-purple-200 p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">Ascended Kids 🌟</h1>
          <div className="flex items-center space-x-2">
            <span className="text-purple-600">Hello, {userProfile?.spiritAnimal || '⭐ Star'} friend!</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Create Post */}
        <Card className="mb-6 border-4 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-600 flex items-center gap-2">
              <Smile className="h-5 w-5" />
              Share Something Kind! 
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What kind thing did you do today? How did it make you feel? 😊"
                className="w-full p-4 border-2 border-purple-200 rounded-lg text-lg resize-none"
                rows={3}
                maxLength={280}
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{newPost.length}/280 characters</span>
                <Button
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Share Kindness!
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card 
              key={post.id} 
              className={`border-4 ${post.isApproved ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-purple-600">{post.author.username}</h3>
                    <p className="text-sm text-gray-600">{post.author.spiritAnimal}</p>
                  </div>
                  {!post.isApproved && (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
                      Waiting for approval 🕐
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{post.content}</p>
                
                {post.isApproved && (
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEngagement(post.id, 'heart')}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Heart className="h-5 w-5 mr-1" />
                      {post.hearts} Hearts
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEngagement(post.id, 'star')}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <Star className="h-5 w-5 mr-1" />
                      {post.stars} Stars
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
