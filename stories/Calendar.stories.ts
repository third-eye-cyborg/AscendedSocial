import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import * as React from 'react';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A date field component for spiritual scheduling and meditation planning.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-cosmic text-white p-8">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Calendar
      mode="single"
      className="rounded-md border"
    />
  ),
};

export const WithPopover: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
};

export const SpiritualScheduling: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">🧘</span>
        Choose Your Meditation Date
      </h3>
      <Calendar
        mode="single"
        className="rounded-md border border-primary/20"
      />
    </div>
  ),
};

export const MoonPhaseCalendar: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <span className="text-2xl">🌙</span>
        Moon Phase Calendar
      </h3>
      <Calendar
        mode="single"
        className="rounded-md border border-purple-500/20"
        modifiers={{
          newMoon: [new Date(2024, 0, 11), new Date(2024, 1, 9)],
          fullMoon: [new Date(2024, 0, 25), new Date(2024, 1, 24)],
        }}
        modifiersClassNames={{
          newMoon: "bg-gray-900 text-white",
          fullMoon: "bg-yellow-400 text-black",
        }}
      />
      <div className="text-sm text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
          <span>New Moon - Perfect for new beginnings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span>Full Moon - Ideal for manifestation</span>
        </div>
      </div>
    </div>
  ),
};

