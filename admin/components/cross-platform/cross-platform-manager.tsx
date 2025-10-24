"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Smartphone, Bell, Download, Upload, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MobileApp {
  id: string
  platform: "iOS" | "Android"
  version: string
  buildNumber: string
  status: "live" | "review" | "development"
  downloads: number
  activeUsers: number
  rating: number
  lastUpdate: string
}

interface AppVersion {
  id: string
  version: string
  buildNumber: string
  releaseDate: string
  status: "live" | "beta" | "deprecated"
  downloads: number
  crashRate: number
}

interface PushNotification {
  id: string
  title: string
  message: string
  platform: "iOS" | "Android" | "Both"
  sentDate: string
  delivered: number
  opened: number
  status: "sent" | "scheduled" | "draft"
}

const mockMobileApps: MobileApp[] = [
  {
    id: "1",
    platform: "iOS",
    version: "2.4.1",
    buildNumber: "241",
    status: "live",
    downloads: 45230,
    activeUsers: 12543,
    rating: 4.7,
    lastUpdate: "2025-01-15",
  },
  {
    id: "2",
    platform: "Android",
    version: "2.4.0",
    buildNumber: "240",
    status: "live",
    downloads: 67890,
    activeUsers: 18932,
    rating: 4.5,
    lastUpdate: "2025-01-12",
  },
]

const mockAppVersions: AppVersion[] = [
  {
    id: "1",
    version: "2.4.1",
    buildNumber: "241",
    releaseDate: "2025-01-15",
    status: "live",
    downloads: 45230,
    crashRate: 0.2,
  },
  {
    id: "2",
    version: "2.4.0",
    buildNumber: "240",
    releaseDate: "2025-01-12",
    status: "live",
    downloads: 67890,
    crashRate: 0.3,
  },
  {
    id: "3",
    version: "2.3.5",
    buildNumber: "235",
    releaseDate: "2024-12-20",
    status: "deprecated",
    downloads: 89234,
    crashRate: 0.8,
  },
]

const mockPushNotifications: PushNotification[] = [
  {
    id: "1",
    title: "New Course Available!",
    message: "Check out our latest Python Mastery course",
    platform: "Both",
    sentDate: "2025-01-23 10:00",
    delivered: 28450,
    opened: 12340,
    status: "sent",
  },
  {
    id: "2",
    title: "Weekend Sale - 50% Off",
    message: "Limited time offer on all premium courses",
    platform: "Both",
    sentDate: "2025-01-22 09:00",
    delivered: 30120,
    opened: 15678,
    status: "sent",
  },
  {
    id: "3",
    title: "Complete Your Profile",
    message: "Add your skills to get personalized recommendations",
    platform: "iOS",
    sentDate: "2025-01-25 14:00",
    delivered: 0,
    opened: 0,
    status: "scheduled",
  },
]

export function CrossPlatformManager() {
  const [notificationEnabled, setNotificationEnabled] = useState(true)
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      live: "bg-green-500/10 text-green-500 border-green-500/20",
      review: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      development: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      beta: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      deprecated: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      sent: "bg-green-500/10 text-green-500 border-green-500/20",
      scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    }
    return <Badge className={variants[status] || "bg-gray-500/10 text-gray-400"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Cross-Platform & Mobile</h1>
        <p className="mt-2 text-gray-400">Manage mobile apps, push notifications, and version control</p>
      </div>

      {/* Mobile App Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">113K</div>
              <Download className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-green-500">+12.5% this month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">31.5K</div>
              <Users className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-green-500">+8.3% this week</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">4.6</div>
              <Smartphone className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-gray-400">Across both platforms</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-400">Push Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-100">58.6K</div>
              <Bell className="h-8 w-8 text-amber-600" />
            </div>
            <p className="mt-2 text-xs text-gray-400">Delivered this week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="apps" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="apps" className="data-[state=active]:bg-amber-600">
            Mobile Apps
          </TabsTrigger>
          <TabsTrigger value="versions" className="data-[state=active]:bg-amber-600">
            Version Control
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-amber-600">
            Push Notifications
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-amber-600">
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Mobile Apps */}
        <TabsContent value="apps" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {mockMobileApps.map((app) => (
              <Card key={app.id} className="border-gray-800 bg-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-600">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-gray-100">{app.platform} App</CardTitle>
                        <CardDescription className="text-gray-400">
                          v{app.version} (Build {app.buildNumber})
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Downloads</p>
                      <p className="text-lg font-semibold text-gray-100">{app.downloads.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Active Users</p>
                      <p className="text-lg font-semibold text-gray-100">{app.activeUsers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Rating</p>
                      <p className="text-lg font-semibold text-gray-100">{app.rating} ⭐</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Last Update</p>
                      <p className="text-lg font-semibold text-gray-100">{app.lastUpdate}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Build
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Version Control */}
        <TabsContent value="versions" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-100">App Version History</CardTitle>
                  <CardDescription className="text-gray-400">
                    Track all app versions and their performance
                  </CardDescription>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Create New Version
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Version</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Build Number</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Release Date</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Downloads</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Crash Rate</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Status</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAppVersions.map((version) => (
                      <tr key={version.id} className="border-b border-gray-800">
                        <td className="py-4 text-sm font-medium text-gray-100">{version.version}</td>
                        <td className="py-4 text-sm text-gray-300">{version.buildNumber}</td>
                        <td className="py-4 text-sm text-gray-300">{version.releaseDate}</td>
                        <td className="py-4 text-sm text-gray-300">{version.downloads.toLocaleString()}</td>
                        <td className="py-4">
                          <span
                            className={`text-sm font-medium ${version.crashRate < 0.5 ? "text-green-500" : version.crashRate < 1 ? "text-yellow-500" : "text-red-500"}`}
                          >
                            {version.crashRate}%
                          </span>
                        </td>
                        <td className="py-4">{getStatusBadge(version.status)}</td>
                        <td className="py-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Push Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-100">Push Notification Campaigns</CardTitle>
                  <CardDescription className="text-gray-400">
                    Send targeted notifications to mobile users
                  </CardDescription>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Bell className="mr-2 h-4 w-4" />
                  Create Notification
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPushNotifications.map((notification) => (
                  <div key={notification.id} className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="font-semibold text-gray-100">{notification.title}</h3>
                          {getStatusBadge(notification.status)}
                          <Badge className="bg-amber-600/10 text-amber-500 border-amber-600/20">
                            {notification.platform}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{notification.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Sent:</span>
                          <span className="ml-2 text-gray-300">{notification.sentDate}</span>
                        </div>
                        {notification.status === "sent" && (
                          <>
                            <div>
                              <span className="text-gray-500">Delivered:</span>
                              <span className="ml-2 text-gray-300">{notification.delivered.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Opened:</span>
                              <span className="ml-2 text-gray-300">
                                {notification.opened.toLocaleString()} (
                                {((notification.opened / notification.delivered) * 100).toFixed(1)}%)
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Mobile App Settings</CardTitle>
              <CardDescription className="text-gray-400">Configure mobile app behavior and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-100">Push Notifications</Label>
                  <p className="text-sm text-gray-400">Enable push notifications for mobile users</p>
                </div>
                <Switch checked={notificationEnabled} onCheckedChange={setNotificationEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-gray-100">Auto-Update</Label>
                  <p className="text-sm text-gray-400">Automatically update app when new version is available</p>
                </div>
                <Switch checked={autoUpdateEnabled} onCheckedChange={setAutoUpdateEnabled} />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-100">Minimum Supported Version</Label>
                <Select defaultValue="2.3.0">
                  <SelectTrigger className="border-gray-700 bg-gray-900 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-700 bg-gray-800">
                    <SelectItem value="2.4.1">v2.4.1</SelectItem>
                    <SelectItem value="2.4.0">v2.4.0</SelectItem>
                    <SelectItem value="2.3.5">v2.3.5</SelectItem>
                    <SelectItem value="2.3.0">v2.3.0</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-400">Users below this version will be prompted to update</p>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-100">Force Update Message</Label>
                <Textarea
                  placeholder="Enter message to display when force update is required..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                  defaultValue="A new version of TechMigo is available. Please update to continue using the app."
                />
              </div>

              <Button className="w-full bg-amber-600 hover:bg-amber-700">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
