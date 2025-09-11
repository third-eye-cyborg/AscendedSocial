import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  BarChart3, 
  Users, 
  Flag, 
  MessageSquare, 
  Activity, 
  Settings,
  Menu,
  LogOut,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChart3,
    description: "Overview and key metrics"
  },
  {
    label: "User Management",
    href: "/admin/users",
    icon: Users,
    description: "Manage user accounts"
  },
  {
    label: "Content Moderation",
    href: "/admin/moderation",
    icon: Flag,
    description: "Review reported content"
  },
  {
    label: "Support Tickets",
    href: "/admin/tickets",
    icon: MessageSquare,
    description: "Handle user support"
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    description: "Detailed analytics"
  },
  {
    label: "System Health",
    href: "/admin/system",
    icon: Activity,
    description: "Monitor system status"
  }
];

function AdminSidebar({ className }: { className?: string }) {
  const [location] = useLocation();
  const { admin, logout } = useAdminAuth();

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        {/* Admin Portal Header */}
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Admin Portal
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Ascended Social
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                  data-testid={`nav-${item.href.split('/').pop()}`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-3 py-2">
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Actions
            </h3>
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Main Site
              </Button>
            </Link>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="px-3 py-2 mt-auto">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-3 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={admin?.profileImageUrl} />
                <AvatarFallback className="bg-purple-600 text-white">
                  {admin?.firstName?.[0]}{admin?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {admin?.firstName} {admin?.lastName}
                </p>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary" className="text-xs">
                    Admin
                  </Badge>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={logout}
              size="sm"
              data-testid="button-admin-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { admin, isLoading, isAuthenticated } = useAdminAuth();
  const [location, setLocation] = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-purple-200 font-medium">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !admin) {
    setLocation("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <span className="font-semibold text-gray-900 dark:text-white">Admin Portal</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:dark:border-gray-700 lg:dark:bg-gray-800">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}