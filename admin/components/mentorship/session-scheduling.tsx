"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, CheckCircle, XCircle, Users } from "lucide-react"

interface Session {
  id: string
  mentor: string
  student: string
  topic: string
  date: string
  time: string
  duration: string
  status: "Scheduled" | "Confirmed" | "Cancelled" | "Completed"
  type: "Video Call" | "In-Person"
}

const mockSessions: Session[] = [
  {
    id: "1",
    mentor: "Dr. Sarah Johnson",
    student: "John Doe",
    topic: "React Performance Optimization",
    date: "2024-03-20",
    time: "14:00",
    duration: "1 hour",
    status: "Scheduled",
    type: "Video Call",
  },
  {
    id: "2",
    mentor: "Michael Chen",
    student: "Jane Smith",
    topic: "Machine Learning Fundamentals",
    date: "2024-03-21",
    time: "10:00",
    duration: "1.5 hours",
    status: "Confirmed",
    type: "Video Call",
  },
  {
    id: "3",
    mentor: "Emily Rodriguez",
    student: "Mike Johnson",
    topic: "UI/UX Design Review",
    date: "2024-03-19",
    time: "16:00",
    duration: "45 minutes",
    status: "Completed",
    type: "Video Call",
  },
]

export function SessionScheduling() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions)
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredSessions = sessions.filter((session) => statusFilter === "all" || session.status === statusFilter)

  const getStatusBadge = (status: Session["status"]) => {
    const colors = {
      Scheduled: "bg-blue-600",
      Confirmed: "bg-green-600",
      Cancelled: "bg-red-600",
      Completed: "bg-gray-600",
    }
    return colors[status]
  }

  const handleConfirm = (session: Session) => {
    console.log("[v0] Confirming session:", session.id)
    setSessions(sessions.map((s) => (s.id === session.id ? { ...s, status: "Confirmed" as const } : s)))
  }

  const handleCancel = (session: Session) => {
    console.log("[v0] Cancelling session:", session.id)
    if (confirm(`Are you sure you want to cancel the session "${session.topic}"?`)) {
      setSessions(sessions.map((s) => (s.id === session.id ? { ...s, status: "Cancelled" as const } : s)))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Session Scheduling</h2>
          <p className="mt-1 text-gray-400">Manage upcoming and scheduled mentorship sessions</p>
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
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="border-gray-700 bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-100">{session.topic}</h3>
                    <Badge className={getStatusBadge(session.status)}>{session.status}</Badge>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      <div>
                        <p className="text-gray-300">{session.mentor}</p>
                        <p className="text-xs">with {session.student}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>
                        {session.time} ({session.duration})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Video className="h-4 w-4" />
                      <span>{session.type}</span>
                    </div>
                  </div>
                </div>
                {session.status === "Scheduled" && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleConfirm(session)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-400 bg-transparent"
                      onClick={() => handleCancel(session)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
