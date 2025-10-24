"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, TrendingUp, Users, DollarSign, Clock, Target, Download } from "lucide-react"

interface AnalyticsMetric {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ComponentType<{ className?: string }>
}

const platformMetrics: AnalyticsMetric[] = [
  {
    label: "Total Users",
    value: "12,543",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Active Users (30d)",
    value: "8,234",
    change: "+8.3%",
    trend: "up",
    icon: Users,
  },
  {
    label: "Total Revenue",
    value: "$145,230",
    change: "+23.1%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "Avg. Session Time",
    value: "24m 35s",
    change: "+5.2%",
    trend: "up",
    icon: Clock,
  },
]

const courseMetrics = [
  {
    id: "1",
    courseName: "React Fundamentals",
    enrollments: 2543,
    completions: 1876,
    completionRate: 74,
    avgRating: 4.8,
    revenue: "$45,230",
  },
  {
    id: "2",
    courseName: "TypeScript Advanced",
    enrollments: 1876,
    completions: 1234,
    completionRate: 66,
    avgRating: 4.6,
    revenue: "$32,450",
  },
  {
    id: "3",
    courseName: "Python Mastery",
    enrollments: 3210,
    completions: 2145,
    completionRate: 67,
    avgRating: 4.7,
    revenue: "$52,100",
  },
]

const userSegments = [
  { segment: "Free Users", count: 8234, percentage: 66, revenue: "$0" },
  { segment: "Pro Users", count: 3456, percentage: 28, revenue: "$89,450" },
  { segment: "Enterprise", count: 853, percentage: 6, revenue: "$55,780" },
]

export function AnalyticsEngine() {
  const [timeframe, setTimeframe] = useState("30d")
  const [reportType, setReportType] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Analytics & Insights Engine</h1>
          <p className="mt-2 text-gray-400">Comprehensive platform analytics and reporting</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px] border-gray-700 bg-gray-800 text-gray-100">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-800">
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-700 bg-gray-800 text-gray-100">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        {platformMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="border-gray-800 bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">{metric.label}</CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-100">{metric.value}</div>
                <p className={`mt-1 text-xs ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {metric.change} from last period
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="platform" className="space-y-4">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="platform" className="data-[state=active]:bg-amber-600">
            Platform Analytics
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-amber-600">
            User Analytics
          </TabsTrigger>
          <TabsTrigger value="courses" className="data-[state=active]:bg-amber-600">
            Course Analytics
          </TabsTrigger>
          <TabsTrigger value="revenue" className="data-[state=active]:bg-amber-600">
            Revenue Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-gray-800 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">User Growth</CardTitle>
                <CardDescription className="text-gray-400">New user registrations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center rounded-lg border border-gray-700 bg-gray-900">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500">Chart visualization placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Engagement Metrics</CardTitle>
                <CardDescription className="text-gray-400">Daily active users and session duration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center rounded-lg border border-gray-700 bg-gray-900">
                  <div className="text-center">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500">Chart visualization placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Platform Health Indicators</CardTitle>
              <CardDescription className="text-gray-400">Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">User Retention Rate (30d)</span>
                  <span className="font-semibold text-gray-100">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Average Course Completion Rate</span>
                  <span className="font-semibold text-gray-100">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Customer Satisfaction Score</span>
                  <span className="font-semibold text-gray-100">4.7/5.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Net Promoter Score (NPS)</span>
                  <span className="font-semibold text-gray-100">+52</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">User Segments</CardTitle>
              <CardDescription className="text-gray-400">Breakdown by subscription tier</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-400">Segment</TableHead>
                    <TableHead className="text-gray-400">Users</TableHead>
                    <TableHead className="text-gray-400">Percentage</TableHead>
                    <TableHead className="text-gray-400">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userSegments.map((segment) => (
                    <TableRow key={segment.segment} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium text-gray-100">{segment.segment}</TableCell>
                      <TableCell className="text-gray-300">{segment.count.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-300">{segment.percentage}%</TableCell>
                      <TableCell className="font-semibold text-amber-500">{segment.revenue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-gray-800 bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Avg. Courses per User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-100">3.2</div>
                <p className="mt-1 text-xs text-green-500">+0.4 from last month</p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Avg. Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-100">24m 35s</div>
                <p className="mt-1 text-xs text-green-500">+5.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Churn Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-100">4.2%</div>
                <p className="mt-1 text-xs text-green-500">-1.3% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Course Performance</CardTitle>
              <CardDescription className="text-gray-400">Detailed metrics for all courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-700/50">
                    <TableHead className="text-gray-400">Course Name</TableHead>
                    <TableHead className="text-gray-400">Enrollments</TableHead>
                    <TableHead className="text-gray-400">Completions</TableHead>
                    <TableHead className="text-gray-400">Completion Rate</TableHead>
                    <TableHead className="text-gray-400">Avg. Rating</TableHead>
                    <TableHead className="text-gray-400">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseMetrics.map((course) => (
                    <TableRow key={course.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell className="font-medium text-gray-100">{course.courseName}</TableCell>
                      <TableCell className="text-gray-300">{course.enrollments.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-300">{course.completions.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-300">{course.completionRate}%</TableCell>
                      <TableCell className="text-gray-300">⭐ {course.avgRating}</TableCell>
                      <TableCell className="font-semibold text-amber-500">{course.revenue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-gray-800 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Top Performing Courses</CardTitle>
                <CardDescription className="text-gray-400">By completion rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center rounded-lg border border-gray-700 bg-gray-900">
                  <div className="text-center">
                    <Target className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500">Chart visualization placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100">Course Revenue Distribution</CardTitle>
                <CardDescription className="text-gray-400">Revenue by course category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center rounded-lg border border-gray-700 bg-gray-900">
                  <div className="text-center">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-600" />
                    <p className="mt-2 text-sm text-gray-500">Chart visualization placeholder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-gray-800 bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-100">$145,230</div>
                <p className="mt-1 text-xs text-green-500">+23.1% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">MRR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-100">$48,450</div>
                <p className="mt-1 text-xs text-green-500">+15.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">ARPU</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-100">$11.58</div>
                <p className="mt-1 text-xs text-green-500">+2.8% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Revenue Breakdown</CardTitle>
              <CardDescription className="text-gray-400">Revenue sources and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Course Sales</span>
                  <span className="font-semibold text-gray-100">$89,450 (62%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Subscriptions</span>
                  <span className="font-semibold text-gray-100">$48,450 (33%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mentorship Sessions</span>
                  <span className="font-semibold text-gray-100">$7,330 (5%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-100">Revenue Trends</CardTitle>
              <CardDescription className="text-gray-400">Monthly revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[250px] items-center justify-center rounded-lg border border-gray-700 bg-gray-900">
                <div className="text-center">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-600" />
                  <p className="mt-2 text-sm text-gray-500">Chart visualization placeholder</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
