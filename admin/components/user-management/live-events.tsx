"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Users, Plus, Edit, Trash2, Video } from "lucide-react"

interface LiveEvent {
  id: string
  title: string
  description: string
  facilitator: string
  date: string
  time: string
  duration: string
  attendees: number
  maxAttendees: number
  status: "Upcoming" | "Live" | "Completed"
}

const mockEvents: LiveEvent[] = [
  {
    id: "1",
    title: "React Hooks Deep Dive",
    description: "Learn advanced React Hooks patterns and best practices",
    facilitator: "John Doe",
    date: "2024-02-15",
    time: "14:00",
    duration: "2 hours",
    attendees: 45,
    maxAttendees: 100,
    status: "Upcoming",
  },
  {
    id: "2",
    title: "TypeScript Masterclass",
    description: "Advanced TypeScript techniques for large-scale applications",
    facilitator: "Jane Smith",
    date: "2024-02-20",
    time: "16:00",
    duration: "3 hours",
    attendees: 78,
    maxAttendees: 100,
    status: "Upcoming",
  },
]

export function LiveEvents() {
  const [events, setEvents] = useState<LiveEvent[]>(mockEvents)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState<LiveEvent | null>(null)

  const handleCreateEvent = () => {
    console.log("[v0] Opening create event dialog")
    setEditingEvent(null)
    setShowEventDialog(true)
  }

  const handleEditEvent = (event: LiveEvent) => {
    console.log("[v0] Editing event:", event.id)
    setEditingEvent(event)
    setShowEventDialog(true)
  }

  const handleDeleteEvent = (event: LiveEvent) => {
    console.log("[v0] Deleting event:", event.id)
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      setEvents(events.filter((e) => e.id !== event.id))
    }
  }

  const handleSaveEvent = () => {
    console.log("[v0] Saving event:", editingEvent ? "edit" : "create")
    setShowEventDialog(false)
    setEditingEvent(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Live Events & Cohorts</h2>
          <p className="mt-1 text-gray-400">Manage online live events and student cohorts</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleCreateEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <Card key={event.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-100">{event.title}</h3>
                    <Badge
                      className={
                        event.status === "Live"
                          ? "bg-red-600"
                          : event.status === "Upcoming"
                            ? "bg-blue-600"
                            : "bg-gray-600"
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{event.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Video className="h-4 w-4" />
                <span>Facilitator: {event.facilitator}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>
                  {event.time} ({event.duration})
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                <span>
                  {event.attendees}/{event.maxAttendees} attendees
                </span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 bg-transparent"
                  onClick={() => handleEditEvent(event)}
                >
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-400 bg-transparent"
                  onClick={() => handleDeleteEvent(event)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Live Event" : "Create Live Event"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingEvent ? "Update event details" : "Set up a new live event or cohort"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Event Title</Label>
              <Input
                defaultValue={editingEvent?.title}
                placeholder="React Hooks Deep Dive"
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
              />
            </div>
            <div>
              <Label className="text-gray-300">Description</Label>
              <Textarea
                defaultValue={editingEvent?.description}
                placeholder="Describe what will be covered in this event..."
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                rows={3}
              />
            </div>
            <div>
              <Label className="text-gray-300">Facilitator</Label>
              <Input
                defaultValue={editingEvent?.facilitator}
                placeholder="John Doe"
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-gray-300">Date</Label>
                <Input
                  type="date"
                  defaultValue={editingEvent?.date}
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div>
                <Label className="text-gray-300">Time</Label>
                <Input
                  type="time"
                  defaultValue={editingEvent?.time}
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div>
                <Label className="text-gray-300">Duration</Label>
                <Input
                  defaultValue={editingEvent?.duration}
                  placeholder="2 hours"
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
              <div>
                <Label className="text-gray-300">Max Attendees</Label>
                <Input
                  type="number"
                  defaultValue={editingEvent?.maxAttendees}
                  placeholder="100"
                  className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEventDialog(false)} className="border-gray-700">
                Cancel
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleSaveEvent}>
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
