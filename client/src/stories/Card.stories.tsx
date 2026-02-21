import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile card component for displaying spiritual content and organizing information in the Ascended Social platform.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Spiritual Vision</CardTitle>
        <CardDescription>Share your divine insights with the community</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Today I experienced a profound connection with the cosmic energy that flows through all living beings. The stars whispered ancient wisdom...</p>
      </CardContent>
      <CardFooter>
        <Button>Share Vision</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="p-6">
        <p>A simple card with just content. Perfect for displaying spiritual quotes or brief insights.</p>
      </CardContent>
    </Card>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Daily Meditation</CardTitle>
        <CardDescription>Your spiritual practice reminder</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Take a moment to center yourself and connect with your inner divine light. Let peace flow through your being.</p>
      </CardContent>
    </Card>
  ),
};

export const OracleCard: Story = {
  render: () => (
    <Card className="w-[400px] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">🔮 Oracle Reading</CardTitle>
        <CardDescription>Guidance from the spiritual realm</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-lg italic">"The path you seek is already within you. Trust your inner wisdom and let your light guide others on their journey."</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline">Request New Reading</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A styled card for oracle readings with mystical theming.',
      },
    },
  },
};

export const CommunityCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ✨ Lightworkers Circle
          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-200">Active</span>
        </CardTitle>
        <CardDescription>A community for spiritual growth and enlightenment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">1,247 members</p>
          <p className="text-sm">Join fellow seekers on the path to higher consciousness. Share experiences, wisdom, and support each other's spiritual journey.</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button>Join Circle</Button>
        <Button variant="outline">Learn More</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A community card for spiritual groups and circles.',
      },
    },
  },
};

export const ProfileCard: Story = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-2xl">
          🌟
        </div>
        <CardTitle>SpiritualSeeker✨</CardTitle>
        <CardDescription>Level 7 Lightworker</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-2">
        <p className="text-sm">Aura Level: Radiant</p>
        <p className="text-sm text-muted-foreground">Joined the cosmic journey 2 years ago</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A user profile card with spiritual elements.',
      },
    },
  },
};