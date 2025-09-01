import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A tabs component for organizing spiritual content and navigation.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="visions" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="visions">Visions</TabsTrigger>
        <TabsTrigger value="sparks">Sparks</TabsTrigger>
        <TabsTrigger value="wisdom">Wisdom</TabsTrigger>
      </TabsList>
      <TabsContent value="visions">
        <Card>
          <CardHeader>
            <CardTitle>🌌 Spiritual Visions</CardTitle>
            <CardDescription>
              Deep insights and mystical experiences from the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Share your profound spiritual visions and cosmic revelations with fellow seekers on the path of enlightenment.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="sparks">
        <Card>
          <CardHeader>
            <CardTitle>✨ Daily Sparks</CardTitle>
            <CardDescription>
              Quick inspirations and spiritual moments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Capture and share brief moments of spiritual inspiration, synchronicities, and divine connections.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="wisdom">
        <Card>
          <CardHeader>
            <CardTitle>🦉 Ancient Wisdom</CardTitle>
            <CardDescription>
              Timeless teachings and spiritual knowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Explore sacred texts, ancient teachings, and timeless wisdom from various spiritual traditions.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const ChakrasTabs: Story = {
  render: () => (
    <Tabs defaultValue="root" className="w-[500px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="root">🔴 Root</TabsTrigger>
        <TabsTrigger value="heart">💚 Heart</TabsTrigger>
        <TabsTrigger value="throat">🔵 Throat</TabsTrigger>
        <TabsTrigger value="crown">🤍 Crown</TabsTrigger>
      </TabsList>
      <TabsContent value="root">
        <Card>
          <CardHeader>
            <CardTitle>🔴 Root Chakra</CardTitle>
            <CardDescription>Muladhara - Foundation and Security</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The root chakra is your foundation for feeling safe and grounded. Focus on stability, security, and connection to the earth.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="heart">
        <Card>
          <CardHeader>
            <CardTitle>💚 Heart Chakra</CardTitle>
            <CardDescription>Anahata - Love and Compassion</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The heart chakra governs love, compassion, and emotional balance. Open your heart to give and receive unconditional love.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="throat">
        <Card>
          <CardHeader>
            <CardTitle>🔵 Throat Chakra</CardTitle>
            <CardDescription>Vishuddha - Communication and Truth</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The throat chakra empowers authentic expression and communication. Speak your truth with clarity and purpose.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="crown">
        <Card>
          <CardHeader>
            <CardTitle>🤍 Crown Chakra</CardTitle>
            <CardDescription>Sahasrara - Divine Connection</CardDescription>
          </CardHeader>
          <CardContent>
            <p>The crown chakra connects you to higher consciousness and spiritual enlightenment. Experience unity with the divine.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const ProfileTabs: Story = {
  render: () => (
    <Tabs defaultValue="posts" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="communities">Communities</TabsTrigger>
        <TabsTrigger value="oracle">Oracle</TabsTrigger>
        <TabsTrigger value="energy">Energy</TabsTrigger>
      </TabsList>
      <TabsContent value="posts" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Recent Spiritual Insights</h4>
              <p className="text-sm text-muted-foreground">Your shared visions and sparks with the community</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="communities" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Spiritual Circles</h4>
              <p className="text-sm text-muted-foreground">Communities you're part of on your spiritual journey</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="oracle" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Oracle History</h4>
              <p className="text-sm text-muted-foreground">Your past readings and spiritual guidance</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="energy" className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Energy Analytics</h4>
              <p className="text-sm text-muted-foreground">Your spiritual energy patterns and aura evolution</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};