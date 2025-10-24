"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useAdminAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  UserCog,
  Settings,
  TrendingUp,
  Mail,
  Megaphone,
  Bot,
  DollarSign,
  Shield,
  Bell,
  Search,
  Menu,
  X,
  Loader2,
} from "lucide-react"
import { UserManagement } from "./user-management/user-management"
import { RBACManagement } from "./rbac/rbac-management"
import { CourseManagement } from "./courses/course-management"
import { StaffManagement } from "./staff/staff-management"
import { PlatformSettings } from "./settings/platform-settings"
import { CommunityHub } from "./community/community-hub"
import { MentorshipSystem } from "./mentorship/mentorship-system"
import { StudentProgress } from "./analytics/student-progress"
import { LeaderboardSystem } from "./analytics/leaderboard-system"
import { AnalyticsEngine } from "./analytics/analytics-engine"
import { MessagingSystem } from "./marketing/messaging-system"
import { MarketingCampaigns } from "./marketing/marketing-campaigns"
import { CRMLeads } from "./marketing/crm-leads"
import { SocialMediaManager } from "./marketing/social-media-manager"
import { AdManagement } from "./marketing/ad-management"
import { RetentionEngine } from "./marketing/retention-engine"
import { AIAssistant } from "./ai/ai-assistant"
import { AutomationWorkflows } from "./ai/automation-workflows"
import { ExperimentSystem } from "./ai/experiment-system"
import { MarketplaceManager } from "./financial/marketplace-manager"
import { ReferralSystem } from "./financial/referral-system"
import { BillingManagement } from "./financial/billing-management"
import { InfrastructureMonitoring } from "./infrastructure/infrastructure-monitoring"
import { SecurityCompliance } from "./security/security-compliance"
import { CrossPlatformManager } from "./cross-platform/cross-platform-manager"
import { PartnershipsManager } from "./partnerships/partnerships-manager"

type Screen =
  | "dashboard"
  | "users"
  | "rbac"
  | "staff"
  | "platform-settings"
  | "courses"
  | "community"
  | "mentorship"
  | "progress"
  | "leaderboard"
  | "messaging"
  | "marketing"
  | "crm"
  | "social-media"
  | "ads"
  | "retention"
  | "ai-assistant"
  | "automation"
  | "experiments"
  | "marketplace"
  | "referrals"
  | "billing"
  | "partnerships"
  | "infrastructure"
  | "security"
  | "cross-platform"
  | "analytics"

interface NavItem {
  id: Screen
  label: string
  icon: React.ComponentType<{ className?: string }>
  category: string
}

const navigationItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, category: "Overview" },
  { id: "users", label: "User Management", icon: Users, category: "User Management" },
  { id: "rbac", label: "Roles & Permissions", icon: Shield, category: "User Management" },
  { id: "staff", label: "Staff Management", icon: UserCog, category: "Internal Operations" },
  { id: "platform-settings", label: "Platform Settings", icon: Settings, category: "Internal Operations" },
  { id: "courses", label: "Course Management", icon: BookOpen, category: "Learning" },
  { id: "community", label: "Community Hub", icon: MessageSquare, category: "Learning" },
  { id: "mentorship", label: "Mentorship", icon: UserCog, category: "Learning" },
  { id: "progress", label: "Student Progress", icon: TrendingUp, category: "Learning" },
  { id: "leaderboard", label: "Leaderboard", icon: TrendingUp, category: "Learning" },
  { id: "messaging", label: "Messaging", icon: Mail, category: "Communication" },
  { id: "marketing", label: "Marketing Campaigns", icon: Megaphone, category: "Marketing" },
  { id: "crm", label: "CRM & Leads", icon: Users, category: "Marketing" },
  { id: "social-media", label: "Social Media", icon: Megaphone, category: "Marketing" },
  { id: "ads", label: "Ad Management", icon: Megaphone, category: "Marketing" },
  { id: "retention", label: "Retention Engine", icon: TrendingUp, category: "Marketing" },
  { id: "ai-assistant", label: "AI Assistant", icon: Bot, category: "AI & Automation" },
  { id: "automation", label: "Automation", icon: Bot, category: "AI & Automation" },
  { id: "experiments", label: "Experiments", icon: TrendingUp, category: "AI & Automation" },
  { id: "marketplace", label: "Marketplace", icon: DollarSign, category: "Financial" },
  { id: "referrals", label: "Referrals", icon: DollarSign, category: "Financial" },
  { id: "billing", label: "Billing & Settings", icon: DollarSign, category: "Financial" },
  { id: "partnerships", label: "Partnerships", icon: Users, category: "Operations" },
  { id: "infrastructure", label: "Infrastructure", icon: Settings, category: "Technical" },
  { id: "security", label: "Security", icon: Shield, category: "Technical" },
  { id: "cross-platform", label: "Cross-Platform", icon: Settings, category: "Technical" },
  { id: "analytics", label: "Analytics Engine", icon: TrendingUp, category: "Insights" },
]

const groupedNav = navigationItems.reduce(
  (acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  },
  {} as Record<string, NavItem[]>,
)

export function AdminDashboard() {
  const [activeScreen, setActiveScreen] = useState<Screen>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { admin, logout } = useAdminAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement search functionality
    console.log("Search:", searchQuery)
  }

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-800 bg-gray-900 transition-transform duration-200 ease-in-out",
          !sidebarOpen && "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
          <h1 className="text-xl font-bold text-gray-100">TechMigo Admin</h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          {Object.entries(groupedNav).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{category}</h3>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeScreen === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveScreen(item.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                        isActive
                          ? "bg-amber-600 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-gray-100",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={cn("flex flex-1 flex-col", sidebarOpen && "ml-64")}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-gray-100"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <form onSubmit={handleSearch} className="relative w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search users, courses, settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gray-700 bg-gray-800 pl-10 text-gray-100 placeholder:text-gray-500"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-400 hover:text-gray-100"
              onClick={() => {
                console.log("[v0] Opening notifications")
                // TODO: Open notifications panel
              }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-600"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    {admin?.avatar ? (
                      <AvatarImage src={admin.avatar} />
                    ) : null}
                    <AvatarFallback className="bg-amber-600 text-white">
                      {admin?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{admin?.name || "Admin User"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-gray-700 bg-gray-800">
                <DropdownMenuLabel className="text-gray-100">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  className="text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                  onClick={() => console.log("[v0] Opening profile settings")}
                >
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                  onClick={() => console.log("[v0] Opening preferences")}
                >
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem
                  className="text-red-400 hover:bg-gray-700 hover:text-red-300"
                  onClick={logout}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-900 p-6">
          <div className="mx-auto max-w-7xl">
            {activeScreen === "dashboard" && <DashboardHome onNavigate={setActiveScreen} />}
            {activeScreen === "users" && <UserManagement />}
            {activeScreen === "rbac" && <RBACManagement />}
            {activeScreen === "staff" && <StaffManagement />}
            {activeScreen === "platform-settings" && <PlatformSettings />}
            {activeScreen === "courses" && <CourseManagement />}
            {activeScreen === "community" && <CommunityHub />}
            {activeScreen === "mentorship" && <MentorshipSystem />}
            {activeScreen === "progress" && <StudentProgress />}
            {activeScreen === "leaderboard" && <LeaderboardSystem />}
            {activeScreen === "messaging" && <MessagingSystem />}
            {activeScreen === "marketing" && <MarketingCampaigns />}
            {activeScreen === "crm" && <CRMLeads />}
            {activeScreen === "social-media" && <SocialMediaManager />}
            {activeScreen === "ads" && <AdManagement />}
            {activeScreen === "retention" && <RetentionEngine />}
            {activeScreen === "ai-assistant" && <AIAssistant />}
            {activeScreen === "automation" && <AutomationWorkflows />}
            {activeScreen === "experiments" && <ExperimentSystem />}
            {activeScreen === "marketplace" && <MarketplaceManager />}
            {activeScreen === "referrals" && <ReferralSystem />}
            {activeScreen === "billing" && <BillingManagement />}
            {activeScreen === "partnerships" && <PartnershipsManager />}
            {activeScreen === "infrastructure" && <InfrastructureMonitoring />}
            {activeScreen === "security" && <SecurityCompliance />}
            {activeScreen === "cross-platform" && <CrossPlatformManager />}
            {activeScreen === "analytics" && <AnalyticsEngine />}
          </div>
        </main>
      </div>
    </div>
  )
}

interface DashboardHomeProps {
  onNavigate: (screen: Screen) => void
}

function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCourses: 0,
    revenue: 0,
    completionRate: 0,
    trends: {
      users: '+0%',
      courses: '+0',
      revenue: '+0%',
      completion: '+0%'
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard-stats')
      const data = await response.json()
      if (data.totalUsers !== undefined) {
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Dashboard Overview</h1>
        <p className="mt-2 text-gray-400">Welcome to the TechMigo Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-center rounded-lg border border-gray-800 bg-gray-800 p-6">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard title="Total Users" value={stats.totalUsers.toLocaleString()} change={stats.trends.users} trend={stats.trends.users.startsWith('+') ? 'up' : 'down'} />
            <StatCard title="Active Courses" value={stats.activeCourses.toString()} change={stats.trends.courses} trend={stats.trends.courses.startsWith('+') ? 'up' : 'down'} />
            <StatCard title="Revenue (MTD)" value={`$${stats.revenue.toLocaleString()}`} change={stats.trends.revenue} trend={stats.trends.revenue.startsWith('+') ? 'up' : 'down'} />
            <StatCard title="Completion Rate" value={`${stats.completionRate}%`} change={stats.trends.completion} trend={stats.trends.completion.startsWith('+') ? 'up' : 'down'} />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-800 bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-100">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Button
            className="bg-amber-600 hover:bg-amber-700"
            onClick={() => onNavigate('courses')}
          >
            Create New Course
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 text-gray-100 hover:bg-gray-700 bg-transparent"
            onClick={() => onNavigate('users')}
          >
            Add User
          </Button>
          <Button
            variant="outline"
            className="border-gray-700 text-gray-100 hover:bg-gray-700 bg-transparent"
            onClick={() => onNavigate('analytics')}
          >
            View Reports
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-800 bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-100">Recent Activity</h2>
        <div className="space-y-4">
          <ActivityItem user="John Doe" action="completed" target="React Fundamentals" time="2 minutes ago" />
          <ActivityItem user="Jane Smith" action="enrolled in" target="Python Mastery" time="15 minutes ago" />
          <ActivityItem user="Mike Johnson" action="upgraded to" target="Pro Plan" time="1 hour ago" />
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  change,
  trend,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-800 p-6">
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-2xl font-semibold text-gray-100">{value}</p>
        <span className={cn("text-sm font-medium", trend === "up" ? "text-green-500" : "text-red-500")}>{change}</span>
      </div>
    </div>
  )
}

function ActivityItem({
  user,
  action,
  target,
  time,
}: {
  user: string
  action: string
  target: string
  time: string
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-700 pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-gray-700 text-gray-300">
            {user
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm text-gray-100">
            <span className="font-medium">{user}</span> {action}{" "}
            <span className="font-medium text-amber-500">{target}</span>
          </p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
    </div>
  )
}
