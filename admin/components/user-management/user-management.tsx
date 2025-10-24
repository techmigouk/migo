"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserDirectory } from "./user-directory"
import { LiveEvents } from "./live-events"

export function UserManagement() {
  return (
    <Tabs defaultValue="directory" className="w-full">
      <TabsList className="bg-gray-700">
        <TabsTrigger value="directory">User Directory</TabsTrigger>
        <TabsTrigger value="live-events">Live Events & Cohorts</TabsTrigger>
      </TabsList>
      <TabsContent value="directory" className="mt-6">
        <UserDirectory />
      </TabsContent>
      <TabsContent value="live-events" className="mt-6">
        <LiveEvents />
      </TabsContent>
    </Tabs>
  )
}
