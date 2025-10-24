"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingDown, AlertTriangle, Target, Mail, Bell } from "lucide-react"

interface RetentionSegment {
  name: string
  users: number
  churnRisk: "low" | "medium" | "high"
  avgEngagement: number
  lastActive: string
}

const mockSegments: RetentionSegment[] = [
  {
    name: "Highly Engaged Users",
    users: 5432,
    churnRisk: "low",
    avgEngagement: 92,
    lastActive: "< 1 day",
  },
  {
    name: "Moderately Active",
    users: 3210,
    churnRisk: "medium",
    avgEngagement: 58,
    lastActive: "3-7 days",
  },
  {
    name: "At-Risk Users",
    users: 1234,
    churnRisk: "high",
    avgEngagement: 23,
    lastActive: "> 14 days",
  },
]

export function RetentionEngine() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Retention Engine</h1>
        <p className="mt-2 text-gray-400">Reduce churn and improve user retention</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Retention Rate</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">78.5%</div>
            <p className="mt-1 text-xs text-green-500">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">4.2%</div>
            <p className="mt-1 text-xs text-green-500">-1.3% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">At-Risk Users</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">1,234</div>
            <p className="mt-1 text-xs text-amber-500">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Win-Back Rate</CardTitle>
            <Target className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-100">32.1%</div>
            <p className="mt-1 text-xs text-green-500">+5.4% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* User Segments */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">User Segments by Engagement</CardTitle>
          <CardDescription className="text-gray-400">Identify and target at-risk users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockSegments.map((segment) => (
            <div key={segment.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-100">{segment.name}</h3>
                  <p className="text-sm text-gray-500">
                    {segment.users.toLocaleString()} users • Last active: {segment.lastActive}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    segment.churnRisk === "high"
                      ? "bg-red-600"
                      : segment.churnRisk === "medium"
                        ? "bg-yellow-600"
                        : "bg-green-600"
                  }
                >
                  {segment.churnRisk} risk
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Engagement Score</span>
                  <span className="font-semibold text-gray-100">{segment.avgEngagement}%</span>
                </div>
                <Progress value={segment.avgEngagement} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-gray-700 bg-gray-900 text-gray-100">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline" className="border-gray-700 bg-gray-900 text-gray-100">
                  <Bell className="mr-2 h-4 w-4" />
                  Push Notification
                </Button>
                <Button size="sm" variant="outline" className="border-gray-700 bg-gray-900 text-gray-100">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Automated Campaigns */}
      <Card className="border-gray-800 bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-100">Automated Retention Campaigns</CardTitle>
          <CardDescription className="text-gray-400">Set up automated win-back campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div>
              <h3 className="font-semibold text-gray-100">Inactive User Re-engagement</h3>
              <p className="text-sm text-gray-500">Trigger: No activity for 14 days</p>
            </div>
            <Badge variant="default" className="bg-green-600">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div>
              <h3 className="font-semibold text-gray-100">Course Completion Reminder</h3>
              <p className="text-sm text-gray-500">Trigger: 50% course progress, no activity for 7 days</p>
            </div>
            <Badge variant="default" className="bg-green-600">
              Active
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div>
              <h3 className="font-semibold text-gray-100">Subscription Renewal Reminder</h3>
              <p className="text-sm text-gray-500">Trigger: 7 days before subscription expires</p>
            </div>
            <Badge variant="default" className="bg-green-600">
              Active
            </Badge>
          </div>

          <Button className="w-full bg-amber-600 hover:bg-amber-700">Create New Campaign</Button>
        </CardContent>
      </Card>
    </div>
  )
}
