import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  Send,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  assignedTo?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  responses: {
    id: string;
    message: string;
    isAdmin: boolean;
    author: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export default function SupportTickets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filterStatus, setFilterStatus] = useState("open");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch support tickets
  const { data: tickets, isLoading } = useQuery<SupportTicket[]>({
    queryKey: ['/api/admin/support-tickets'],
  });

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: ({ ticketId, updates }: { ticketId: string; updates: any }) =>
      apiRequest(`/api/admin/support-tickets/${ticketId}`, 'PATCH', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/support-tickets'] });
      toast({ title: "Ticket updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update ticket", variant: "destructive" });
    },
  });

  // Add response mutation
  const addResponseMutation = useMutation({
    mutationFn: ({ ticketId, message }: { ticketId: string; message: string }) =>
      apiRequest(`/api/admin/support-tickets/${ticketId}/responses`, 'POST', { message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/support-tickets'] });
      toast({ title: "Response sent successfully" });
      setResponseMessage("");
    },
    onError: () => {
      toast({ title: "Failed to send response", variant: "destructive" });
    },
  });

  const handleUpdateTicket = (ticketId: string, updates: any) => {
    updateTicketMutation.mutate({ ticketId, updates });
  };

  const handleSendResponse = (ticketId: string) => {
    if (!responseMessage.trim()) {
      toast({ title: "Please enter a response message", variant: "destructive" });
      return;
    }
    addResponseMutation.mutate({ ticketId, message: responseMessage });
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      urgent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      closed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const filteredTickets = (tickets || []).filter((ticket: SupportTicket) => {
    const matchesSearch = !searchTerm || 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const ticketCounts = {
    open: (tickets || []).filter((t: SupportTicket) => t.status === 'open').length,
    in_progress: (tickets || []).filter((t: SupportTicket) => t.status === 'in_progress').length,
    resolved: (tickets || []).filter((t: SupportTicket) => t.status === 'resolved').length,
    total: (tickets || []).length
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading tickets...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="support-tickets">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage user support requests</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketCounts.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketCounts.in_progress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketCounts.resolved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ticketCounts.total}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets by subject, description, or user email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-ticket-search"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket: SupportTicket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="space-y-1 max-w-xs">
                          <p className="font-medium text-sm truncate">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {ticket.description}
                          </p>
                          {ticket.responses.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {ticket.responses.length} responses
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={ticket.user.profileImageUrl} />
                            <AvatarFallback>
                              {ticket.user.firstName[0]}{ticket.user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {ticket.user.firstName} {ticket.user.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {ticket.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ticket.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(ticket.createdAt))} ago
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(ticket.updatedAt))} ago
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(ticket)}>
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{ticket.subject}</DialogTitle>
                              <DialogDescription>
                                Ticket #{ticket.id} • Created {formatDistanceToNow(new Date(ticket.createdAt))} ago
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Ticket Info */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Priority</label>
                                  <Select 
                                    value={ticket.priority} 
                                    onValueChange={(value) => handleUpdateTicket(ticket.id, { priority: value })}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="low">Low</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <Select 
                                    value={ticket.status} 
                                    onValueChange={(value) => handleUpdateTicket(ticket.id, { status: value })}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="open">Open</SelectItem>
                                      <SelectItem value="in_progress">In Progress</SelectItem>
                                      <SelectItem value="resolved">Resolved</SelectItem>
                                      <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Category</label>
                                  <p className="text-sm text-muted-foreground mt-1">{ticket.category}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">User</label>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {ticket.user.firstName} {ticket.user.lastName}
                                  </p>
                                </div>
                              </div>

                              {/* Original Description */}
                              <div>
                                <label className="text-sm font-medium">Description</label>
                                <div className="mt-1 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                                  <p className="text-sm">{ticket.description}</p>
                                </div>
                              </div>

                              {/* Conversation */}
                              <div>
                                <label className="text-sm font-medium">Conversation</label>
                                <div className="mt-2 space-y-3 max-h-64 overflow-y-auto">
                                  {ticket.responses.map((response: { id: string; message: string; isAdmin: boolean; author: { firstName: string; lastName: string }; createdAt: string }) => (
                                    <div 
                                      key={response.id} 
                                      className={`p-3 rounded-lg ${
                                        response.isAdmin 
                                          ? 'bg-purple-50 dark:bg-purple-900/20 ml-8' 
                                          : 'bg-gray-50 dark:bg-gray-900 mr-8'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium">
                                          {response.author.firstName} {response.author.lastName}
                                          {response.isAdmin && (
                                            <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
                                          )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {formatDistanceToNow(new Date(response.createdAt))} ago
                                        </p>
                                      </div>
                                      <p className="text-sm">{response.message}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Response Form */}
                              <div>
                                <label className="text-sm font-medium">Add Response</label>
                                <div className="mt-2 space-y-2">
                                  <Textarea
                                    placeholder="Type your response..."
                                    value={responseMessage}
                                    onChange={(e) => setResponseMessage(e.target.value)}
                                    rows={3}
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      onClick={() => handleSendResponse(ticket.id)}
                                      disabled={addResponseMutation.isPending || !responseMessage.trim()}
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Send Response
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        handleSendResponse(ticket.id);
                                        handleUpdateTicket(ticket.id, { status: 'resolved' });
                                      }}
                                      disabled={addResponseMutation.isPending || !responseMessage.trim()}
                                    >
                                      Send & Resolve
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}