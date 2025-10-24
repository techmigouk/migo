"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, TrendingUp, Award } from "lucide-react"

interface StaffPerformance {
  id: string
  name: string
  role: string
  tasksCompleted: number
  avgResponseTime: string
  userSatisfaction: number
  achievements: string[]
}

const mockPerformance: StaffPerformance[] = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "Platform Admin",
    tasksCompleted: 156,
    avgResponseTime: "2.3 hours",
    userSatisfaction: 98,
    achievements: ["Top Performer", "Quick Responder"],
  },
  {
    id: "2",
    name: "Bob Smith",
    role: "Content Manager",
    tasksCompleted: 142,
    avgResponseTime: "3.1 hours",
    userSatisfaction: 95,
    achievements: ["Content Expert"],
  },
  {
    id: "3",
    name: "Carol Davis",
    role: "Support Lead",
    tasksCompleted: 203,
    avgResponseTime: "1.8 hours",
    userSatisfaction: 97,
    achievements: ["Top Performer", "Customer Champion"],
  },
]

export function PerformanceTracking() {
  const [performance, setPerformance] = useState<StaffPerformance[]>(mockPerformance)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Performance Tracking</h2>
        <p className="mt-1 text-gray-400">Monitor staff productivity and achievements</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {performance.map((staff) => (
          <Card key={staff.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/generic-placeholder-icon.png?height=48&width=48`} />
                  <AvatarFallback className="bg-gray-700 text-gray-300">
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-100">{staff.name}</h3>
                  <p className="text-sm text-gray-400">{staff.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-3">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                    <p className="text-xs text-gray-400">Tasks</p>
                  </div>
                  <p className="mt-1 text-xl font-bold text-gray-100">{staff.tasksCompleted}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-3">
                  <div className="flex items-center gap-2 text-blue-500">
                    <Clock className="h-4 w-4" />
                    <p className="text-xs text-gray-400">Avg Time</p>
                  </div>
                  <p className="mt-1 text-sm font-bold text-gray-100">{staff.avgResponseTime}</p>
                </div>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-500">
                    <TrendingUp className="h-4 w-4" />
                    <p className="text-xs text-gray-400">Satisfaction</p>
                  </div>
                  <p className="text-xl font-bold text-gray-100">{staff.userSatisfaction}%</p>
                </div>
              </div>
              {staff.achievements.length > 0 && (
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    <p className="text-xs text-gray-400">Achievements</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {staff.achievements.map((achievement) => (
                      <Badge key={achievement} className="bg-amber-600 text-white text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
