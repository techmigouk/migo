"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MentorDirectory } from "./mentor-directory"
import { SessionScheduling } from "./session-scheduling"
import { SessionHistory } from "./session-history"
import { MentorReviews } from "./mentor-reviews"

export function MentorshipSystem() {
  const [activeTab, setActiveTab] = useState("mentors")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Mentorship System</h1>
        <p className="mt-2 text-gray-400">Manage mentors, sessions, and student-mentor relationships</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="mentors">Mentor Directory</TabsTrigger>
          <TabsTrigger value="scheduling">Session Scheduling</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="mt-6">
          <MentorDirectory />
        </TabsContent>

        <TabsContent value="scheduling" className="mt-6">
          <SessionScheduling />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <SessionHistory />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <MentorReviews />
        </TabsContent>
      </Tabs>
    </div>
  )
}
