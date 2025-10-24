"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface ModerationItem {
  id: string
  type: "Post" | "Comment" | "User"
  content: string
  author: string
  reason: string
  status: "Pending" | "Approved" | "Rejected"
  reportedAt: string
  reportedBy: string
}

const mockModerationQueue: ModerationItem[] = [
  {
    id: "1",
    type: "Post",
    content: "This is a potentially inappropriate post that needs review...",
    author: "User123",
    reason: "Spam",
    status: "Pending",
    reportedAt: "2024-03-15 14:30",
    reportedBy: "ModeratorA",
  },
  {
    id: "2",
    type: "Comment",
    content: "Offensive comment that violates community guidelines...",
    author: "User456",
    reason: "Harassment",
    status: "Pending",
    reportedAt: "2024-03-15 13:45",
    reportedBy: "User789",
  },
  {
    id: "3",
    type: "Post",
    content: "Promotional content without disclosure...",
    author: "User789",
    reason: "Self-promotion",
    status: "Approved",
    reportedAt: "2024-03-15 12:20",
    reportedBy: "ModeratorB",
  },
]

export function ModerationTools() {
  const [queue, setQueue] = useState<ModerationItem[]>(mockModerationQueue)
  const [statusFilter, setStatusFilter] = useState("all")
  const [showContextDialog, setShowContextDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null)

  const filteredQueue = queue.filter((item) => statusFilter === "all" || item.status === statusFilter)

  const getStatusBadge = (status: ModerationItem["status"]) => {
    const colors = {
      Pending: "bg-yellow-600",
      Approved: "bg-green-600",
      Rejected: "bg-red-600",
    }
    return colors[status]
  }

  const getReasonColor = (reason: string) => {
    const colors: Record<string, string> = {
      Spam: "border-orange-600 text-orange-500",
      Harassment: "border-red-600 text-red-500",
      "Self-promotion": "border-blue-600 text-blue-500",
    }
    return colors[reason] || "border-gray-600 text-gray-400"
  }

  const handleApprove = (item: ModerationItem) => {
    console.log("[v0] Approving item:", item.id)
    setQueue(queue.map((i) => (i.id === item.id ? { ...i, status: "Approved" as const } : i)))
  }

  const handleReject = (item: ModerationItem) => {
    console.log("[v0] Rejecting item:", item.id)
    setQueue(queue.map((i) => (i.id === item.id ? { ...i, status: "Rejected" as const } : i)))
  }

  const handleViewContext = (item: ModerationItem) => {
    console.log("[v0] Viewing full context for:", item.id)
    setSelectedItem(item)
    setShowContextDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Moderation Queue</h2>
          <p className="mt-1 text-gray-400">Review and moderate flagged content</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-600">{queue.filter((i) => i.status === "Pending").length} Pending</Badge>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Moderation Queue */}
      <div className="space-y-4">
        {filteredQueue.map((item) => (
          <Card key={item.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 text-amber-500">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {item.type}
                      </Badge>
                      <Badge variant="outline" className={getReasonColor(item.reason)}>
                        {item.reason}
                      </Badge>
                      <Badge className={getStatusBadge(item.status)}>{item.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                      Reported by {item.reportedBy} • {item.reportedAt}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-700 text-gray-300 text-xs">
                    {item.author.split("").slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-100">{item.author}</span>
              </div>
              <p className="text-sm text-gray-400 rounded-lg border border-gray-700 bg-gray-900 p-3">{item.content}</p>
              {item.status === "Pending" && (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(item)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 bg-transparent"
                    onClick={() => handleReject(item)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-700 text-gray-300 bg-transparent"
                    onClick={() => handleViewContext(item)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Full Context
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Context Dialog */}
      <Dialog open={showContextDialog} onOpenChange={setShowContextDialog}>
        <DialogContent className="max-w-3xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Full Context</DialogTitle>
            <DialogDescription className="text-gray-400">Complete details about the reported content</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <p className="text-sm text-gray-400">Content</p>
                <p className="mt-2 text-gray-100">{selectedItem.content}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Author</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedItem.author}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Reason</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedItem.reason}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Reported By</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedItem.reportedBy}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Reported At</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedItem.reportedAt}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
