import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Ban, 
  UserCheck, 
  Eye, 
  Mail,
  Calendar,
  Crown,
  Users,
  Trash2
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AdminLayout from "@/components/admin/AdminLayout";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  profileImageUrl?: string;
  isPremium: boolean;
  isActive: boolean;
  isBanned: boolean;
  createdAt: string;
  lastLoginAt?: string;
  totalPosts: number;
  totalEngagements: number;
  preferredChakra?: string;
  moderationHistory?: {
    id: string;
    action: string;
    reason: string;
    moderatedBy: string;
    moderatedAt: string;
  }[];
}

interface ModerationAction {
  userId: string;
  action: 'ban' | 'unban' | 'delete' | 'warn';
  reason: string;
  duration?: number; // for temporary bans
}

export default function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [moderationReason, setModerationReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(50);

  // Fetch users with pagination and filters
  const { data: usersData, isLoading } = useQuery<{ users: User[]; total: number }>({
    queryKey: ['/api/admin/users', currentPage, pageSize, searchTerm, filterStatus, filterType],
    enabled: searchTerm.length >= 2 || searchTerm.length === 0, // Only search if 2+ chars or empty
  });

  const users = usersData?.users || [];
  const totalUsers = usersData?.total || 0;

  // Mutation for user moderation actions
  const moderateUserMutation = useMutation({
    mutationFn: (action: ModerationAction) =>
      apiRequest(`/api/admin/users/${action.userId}/moderate`, 'POST', action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "User moderation action completed successfully" });
      setSelectedUser(null);
      setModerationReason("");
    },
    onError: () => {
      toast({ title: "Failed to perform moderation action", variant: "destructive" });
    },
  });

  const handleModerateUser = (user: User, action: 'ban' | 'unban' | 'delete' | 'warn') => {
    if (!moderationReason.trim() && action !== 'unban') {
      toast({ title: "Please provide a reason for this action", variant: "destructive" });
      return;
    }

    moderateUserMutation.mutate({
      userId: user.id,
      action,
      reason: moderationReason
    });
  };

  const getUserStatusBadge = (user: User) => {
    if (user.isBanned) return <Badge variant="destructive">Banned</Badge>;
    if (!user.isActive) return <Badge variant="secondary">Inactive</Badge>;
    if (user.isPremium) return <Badge className="bg-purple-600 text-white">Premium</Badge>;
    return <Badge variant="outline">Active</Badge>;
  };

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" ||
      (filterStatus === "active" && user.isActive && !user.isBanned) ||
      (filterStatus === "banned" && user.isBanned) ||
      (filterStatus === "inactive" && !user.isActive);

    const matchesType = filterType === "all" ||
      (filterType === "premium" && user.isPremium) ||
      (filterType === "free" && !user.isPremium);

    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="user-management">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage user accounts and moderation</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              <Users className="w-4 h-4 mr-1" />
              {totalUsers} total users
            </Badge>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email, name, or username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-user-search"
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>
              All registered users with moderation controls
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.profileImageUrl} />
                            <AvatarFallback>
                              {user.firstName[0]}{user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                              {user.isPremium && <Crown className="inline w-4 h-4 ml-1 text-yellow-500" />}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                            {user.username && (
                              <div className="text-xs text-muted-foreground">
                                @{user.username}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getUserStatusBadge(user)}
                        {user.preferredChakra && (
                          <Badge variant="outline" className="ml-1 text-xs">
                            {user.preferredChakra}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user.totalPosts} posts</div>
                          <div className="text-muted-foreground">
                            {user.totalEngagements} engagements
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(new Date(user.createdAt))} ago
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {user.lastLoginAt ? (
                            formatDistanceToNow(new Date(user.lastLoginAt)) + " ago"
                          ) : (
                            "Never"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>User Details: {user.firstName} {user.lastName}</DialogTitle>
                                <DialogDescription>
                                  Complete user profile and moderation history
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Username</label>
                                    <p className="text-sm text-muted-foreground">{user.username || "Not set"}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Account Type</label>
                                    <p className="text-sm text-muted-foreground">
                                      {user.isPremium ? "Premium" : "Free"}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Preferred Chakra</label>
                                    <p className="text-sm text-muted-foreground">
                                      {user.preferredChakra || "Not selected"}
                                    </p>
                                  </div>
                                </div>
                                
                                {user.moderationHistory && user.moderationHistory.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium">Moderation History</label>
                                    <div className="mt-2 space-y-2">
                                      {user.moderationHistory.map((action: { id: string; action: string; reason: string; moderatedBy: string; moderatedAt: string }) => (
                                        <div key={action.id} className="p-2 border rounded-lg">
                                          <div className="flex justify-between items-start">
                                            <div>
                                              <Badge variant="outline">{action.action}</Badge>
                                              <p className="text-sm mt-1">{action.reason}</p>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {formatDistanceToNow(new Date(action.moderatedAt))} ago
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {!user.isBanned ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Ban className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Ban User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will ban {user.firstName} {user.lastName} from the platform.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="py-4">
                                  <Textarea
                                    placeholder="Reason for ban (required)"
                                    value={moderationReason}
                                    onChange={(e) => setModerationReason(e.target.value)}
                                  />
                                </div>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setModerationReason("")}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleModerateUser(user, 'ban')}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Ban User
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleModerateUser(user, 'unban')}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
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