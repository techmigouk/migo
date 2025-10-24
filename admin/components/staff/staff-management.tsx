"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaffDirectory } from "./staff-directory"
import { ActivityLogs } from "./activity-logs"
import { PerformanceTracking } from "./performance-tracking"

export function StaffManagement() {
  const [activeTab, setActiveTab] = useState("directory")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Staff Management</h1>
        <p className="mt-2 text-gray-400">Manage internal team members and track their activities</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-6">
          <StaffDirectory />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityLogs />
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <PerformanceTracking />
        </TabsContent>
      </Tabs>
    </div>
  )
}
