"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ForumManagement } from "./forum-management"
import { ModerationTools } from "./moderation-tools"
import { UserReports } from "./user-reports"

export function CommunityHub() {
  const [activeTab, setActiveTab] = useState("forums")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Community Hub</h1>
        <p className="mt-2 text-gray-400">Manage forums, discussions, and community interactions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="forums">Forums & Posts</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="reports">User Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="forums" className="mt-6">
          <ForumManagement />
        </TabsContent>

        <TabsContent value="moderation" className="mt-6">
          <ModerationTools />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <UserReports />
        </TabsContent>
      </Tabs>
    </div>
  )
}
