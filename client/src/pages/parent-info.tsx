
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Users, Clock, CheckCircle, Lock } from 'lucide-react';

export default function ParentInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Safety First: Information for Parents & Guardians
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ascended Kids is designed with the highest safety standards to provide a secure, 
            educational, and inspiring environment for children ages 6-17.
          </p>
        </div>

        {/* Safety Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <Shield className="h-8 w-8 text-blue-600 mx-auto" />
              <CardTitle className="text-blue-600 text-center">Content Moderation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li>✅ All posts reviewed before publishing</li>
                <li>✅ Trained child safety moderators</li>
                <li>✅ 24/7 monitoring</li>
                <li>✅ Zero tolerance for inappropriate content</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200">
            <CardHeader>
              <Eye className="h-8 w-8 text-green-600 mx-auto" />
              <CardTitle className="text-green-600 text-center">Privacy Protection</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li>✅ COPPA compliant (under 13)</li>
                <li>✅ No personal information collected</li>
                <li>✅ No location tracking</li>
                <li>✅ Anonymous usernames only</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200">
            <CardHeader>
              <Users className="h-8 w-8 text-purple-600 mx-auto" />
              <CardTitle className="text-purple-600 text-center">Safe Interactions</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li>✅ No private messaging</li>
                <li>✅ Public comments only</li>
                <li>✅ Kindness-focused interactions</li>
                <li>✅ Easy reporting system</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200">
            <CardHeader>
              <Clock className="h-8 w-8 text-yellow-600 mx-auto" />
              <CardTitle className="text-yellow-600 text-center">Time Management</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li>✅ Built-in usage timers</li>
                <li>✅ Break reminders</li>
                <li>✅ Parent dashboard access</li>
                <li>✅ Healthy usage encouragement</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200">
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-red-600 mx-auto" />
              <CardTitle className="text-red-600 text-center">Educational Value</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li>✅ Emotional intelligence focus</li>
                <li>✅ Kindness and empathy building</li>
                <li>✅ Age-appropriate mindfulness</li>
                <li>✅ Positive community values</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-indigo-200">
            <CardHeader>
              <Lock className="h-8 w-8 text-indigo-600 mx-auto" />
              <CardTitle className="text-indigo-600 text-center">Parental Controls</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="space-y-2 text-sm">
                <li>✅ Parent verification required</li>
                <li>✅ Activity reports available</li>
                <li>✅ Time limit settings</li>
                <li>✅ Account deletion anytime</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Age Requirements */}
        <Card className="mb-12 border-4 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-600 text-center text-2xl">Age Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-orange-600 mb-2">Ages 6-12: Extra Protection</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Parent email verification required</li>
                  <li>• Additional content filtering</li>
                  <li>• Limited interaction features</li>
                  <li>• Simplified interface</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-orange-600 mb-2">Ages 13-17: More Freedom</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Enhanced creative features</li>
                  <li>• Community leadership opportunities</li>
                  <li>• Peer mentoring programs</li>
                  <li>• Advanced emotional tools</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-4 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-600 text-center">Contact & Support</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">Questions about your child's safety or account?</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> parents@ascended-kids.com</p>
              <p><strong>Phone:</strong> 1-800-KIDS-SAFE</p>
              <p><strong>Emergency:</strong> Report inappropriate content instantly through the app</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
