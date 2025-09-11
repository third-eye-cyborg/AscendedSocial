import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A responsive table component for displaying spiritual data.',
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV002</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>PayPal</TableCell>
          <TableCell className="text-right">$150.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">INV003</TableCell>
          <TableCell>Unpaid</TableCell>
          <TableCell>Bank Transfer</TableCell>
          <TableCell className="text-right">$350.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const ChakraBalance: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Chakra</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Element</TableHead>
          <TableHead>Balance</TableHead>
          <TableHead className="text-right">Energy Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium flex items-center gap-2">
            <span className="text-red-500">🔴</span>
            Root
          </TableCell>
          <TableCell className="text-red-500">Red</TableCell>
          <TableCell>Earth</TableCell>
          <TableCell>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Balanced</Badge>
          </TableCell>
          <TableCell className="text-right">85%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium flex items-center gap-2">
            <span className="text-orange-500">🟠</span>
            Sacral
          </TableCell>
          <TableCell className="text-orange-500">Orange</TableCell>
          <TableCell>Water</TableCell>
          <TableCell>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Moderate</Badge>
          </TableCell>
          <TableCell className="text-right">72%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium flex items-center gap-2">
            <span className="text-green-500">🟢</span>
            Heart
          </TableCell>
          <TableCell className="text-green-500">Green</TableCell>
          <TableCell>Air</TableCell>
          <TableCell>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Excellent</Badge>
          </TableCell>
          <TableCell className="text-right">92%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium flex items-center gap-2">
            <span className="text-blue-500">🔵</span>
            Throat
          </TableCell>
          <TableCell className="text-blue-500">Blue</TableCell>
          <TableCell>Sound</TableCell>
          <TableCell>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Good</Badge>
          </TableCell>
          <TableCell className="text-right">78%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium flex items-center gap-2">
            <span className="text-purple-500">🟣</span>
            Crown
          </TableCell>
          <TableCell className="text-purple-500">Violet</TableCell>
          <TableCell>Thought</TableCell>
          <TableCell>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Awakening</Badge>
          </TableCell>
          <TableCell className="text-right">88%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const SpiritualPractices: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Practice</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead className="text-right">Completion</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium flex items-center gap-2">
            <span>🧘</span>
            Daily Meditation
          </TableCell>
          <TableCell>20 minutes</TableCell>
          <TableCell>Daily</TableCell>
          <TableCell>
            <Badge className="bg-green-500/20 text-green-400">On Track</Badge>
          </TableCell>
          <TableCell className="text-right">87%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium flex items-center gap-2">
            <span>🙏</span>
            Gratitude Journal
          </TableCell>
          <TableCell>10 minutes</TableCell>
          <TableCell>Daily</TableCell>
          <TableCell>
            <Badge className="bg-blue-500/20 text-blue-400">Consistent</Badge>
          </TableCell>
          <TableCell className="text-right">94%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium flex items-center gap-2">
            <span>⚡</span>
            Energy Healing
          </TableCell>
          <TableCell>30 minutes</TableCell>
          <TableCell>Weekly</TableCell>
          <TableCell>
            <Badge className="bg-yellow-500/20 text-yellow-400">Improving</Badge>
          </TableCell>
          <TableCell className="text-right">65%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium flex items-center gap-2">
            <span>🌱</span>
            Nature Connection
          </TableCell>
          <TableCell>60 minutes</TableCell>
          <TableCell>Bi-weekly</TableCell>
          <TableCell>
            <Badge className="bg-green-500/20 text-green-400">Excellent</Badge>
          </TableCell>
          <TableCell className="text-right">91%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const MoonPhases: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Phase</TableHead>
          <TableHead>Energy</TableHead>
          <TableHead>Best For</TableHead>
          <TableHead className="text-right">Intensity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Jan 11, 2024</TableCell>
          <TableCell className="flex items-center gap-2">
            <span>🌑</span>
            New Moon
          </TableCell>
          <TableCell>
            <Badge className="bg-gray-500/20 text-gray-400">Reflective</Badge>
          </TableCell>
          <TableCell>New beginnings, setting intentions</TableCell>
          <TableCell className="text-right">Low</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jan 18, 2024</TableCell>
          <TableCell className="flex items-center gap-2">
            <span>🌓</span>
            First Quarter
          </TableCell>
          <TableCell>
            <Badge className="bg-blue-500/20 text-blue-400">Building</Badge>
          </TableCell>
          <TableCell>Taking action, overcoming challenges</TableCell>
          <TableCell className="text-right">Medium</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jan 25, 2024</TableCell>
          <TableCell className="flex items-center gap-2">
            <span>🌕</span>
            Full Moon
          </TableCell>
          <TableCell>
            <Badge className="bg-yellow-500/20 text-yellow-400">Peak</Badge>
          </TableCell>
          <TableCell>Manifestation, release, celebration</TableCell>
          <TableCell className="text-right">High</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Feb 2, 2024</TableCell>
          <TableCell className="flex items-center gap-2">
            <span>🌗</span>
            Last Quarter
          </TableCell>
          <TableCell>
            <Badge className="bg-purple-500/20 text-purple-400">Releasing</Badge>
          </TableCell>
          <TableCell>Forgiveness, letting go, gratitude</TableCell>
          <TableCell className="text-right">Medium</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

