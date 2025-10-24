"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Star, Users, Calendar, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Mentor {
  id: string
  name: string
  email: string
  expertise: string[]
  rating: number
  totalSessions: number
  activeStudents: number
  availability: "Available" | "Busy" | "Unavailable"
  hourlyRate: string
}

const mockMentors: Mentor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.j@techmigo.com",
    expertise: ["React", "TypeScript", "System Design"],
    rating: 4.9,
    totalSessions: 156,
    activeStudents: 12,
    availability: "Available",
    hourlyRate: "$80/hr",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.c@techmigo.com",
    expertise: ["Python", "Machine Learning", "Data Science"],
    rating: 4.8,
    totalSessions: 203,
    activeStudents: 18,
    availability: "Busy",
    hourlyRate: "$75/hr",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@techmigo.com",
    expertise: ["UI/UX Design", "Figma", "Product Design"],
    rating: 4.95,
    totalSessions: 142,
    activeStudents: 10,
    availability: "Available",
    hourlyRate: "$70/hr",
  },
]

export function MentorDirectory() {
  const [mentors, setMentors] = useState<Mentor[]>(mockMentors)
  const [searchQuery, setSearchQuery] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [showAddMentorDialog, setShowAddMentorDialog] = useState(false)
  const [showMentorProfileDialog, setShowMentorProfileDialog] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null)

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAvailability = availabilityFilter === "all" || mentor.availability === availabilityFilter
    return matchesSearch && matchesAvailability
  })

  const getAvailabilityBadge = (availability: Mentor["availability"]) => {
    const colors = {
      Available: "bg-green-600",
      Busy: "bg-yellow-600",
      Unavailable: "bg-red-600",
    }
    return colors[availability]
  }

  const handleAddMentor = () => {
    console.log("[v0] Opening add mentor dialog")
    setEditingMentor(null)
    setShowAddMentorDialog(true)
  }

  const handleViewMentorProfile = (mentor: Mentor) => {
    console.log("[v0] Viewing mentor profile:", mentor.id)
    setSelectedMentor(mentor)
    setShowMentorProfileDialog(true)
  }

  const handleEditMentor = (mentor: Mentor) => {
    console.log("[v0] Editing mentor:", mentor.id)
    setEditingMentor(mentor)
    setShowAddMentorDialog(true)
  }

  const handleDeleteMentor = (mentor: Mentor) => {
    console.log("[v0] Deleting mentor:", mentor.id)
    if (confirm(`Are you sure you want to remove ${mentor.name} as a mentor?`)) {
      setMentors(mentors.filter((m) => m.id !== mentor.id))
    }
  }

  const handleSaveMentor = () => {
    console.log("[v0] Saving mentor:", editingMentor ? "edit" : "create")
    setShowAddMentorDialog(false)
    setEditingMentor(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Mentor Directory</h2>
          <p className="mt-1 text-gray-400">Manage platform mentors and their profiles</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleAddMentor}>
          <Plus className="mr-2 h-4 w-4" />
          Add Mentor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-gray-700 bg-gray-800 pl-10 text-gray-100"
          />
        </div>
        <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
          <SelectTrigger className="w-[150px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Busy">Busy</SelectItem>
            <SelectItem value="Unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mentor Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/mentor-avatar.png?height=48&width=48`} />
                    <AvatarFallback className="bg-gray-700 text-gray-300">
                      {mentor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-100">{mentor.name}</h3>
                    <p className="text-sm text-gray-400">{mentor.email}</p>
                  </div>
                </div>
                <Badge className={getAvailabilityBadge(mentor.availability)}>{mentor.availability}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-amber-600 text-amber-500">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="mt-1 text-lg font-bold text-gray-100">{mentor.rating}</p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-500">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <p className="mt-1 text-lg font-bold text-gray-100">{mentor.totalSessions}</p>
                  <p className="text-xs text-gray-400">Sessions</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-green-500">
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="mt-1 text-lg font-bold text-gray-100">{mentor.activeStudents}</p>
                  <p className="text-xs text-gray-400">Students</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-700">
                <p className="text-center text-lg font-semibold text-amber-500">{mentor.hourlyRate}</p>
              </div>
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 bg-transparent"
                onClick={() => handleViewMentorProfile(mentor)}
              >
                View Profile
              </Button>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-700 text-gray-300 bg-transparent"
                  onClick={() => handleEditMentor(mentor)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-600 text-red-400 bg-transparent"
                  onClick={() => handleDeleteMentor(mentor)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showMentorProfileDialog} onOpenChange={setShowMentorProfileDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl">Mentor Profile</DialogTitle>
            <DialogDescription className="text-gray-400">{selectedMentor?.name}</DialogDescription>
          </DialogHeader>
          {selectedMentor && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedMentor.email}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Hourly Rate</p>
                  <p className="mt-1 font-medium text-gray-100">{selectedMentor.hourlyRate}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Rating</p>
                  <p className="mt-1 text-2xl font-bold text-amber-500">{selectedMentor.rating}</p>
                </div>
                <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <p className="text-sm text-gray-400">Total Sessions</p>
                  <p className="mt-1 text-2xl font-bold text-amber-500">{selectedMentor.totalSessions}</p>
                </div>
              </div>
              <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
                <p className="text-sm text-gray-400 mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMentor.expertise.map((skill) => (
                    <Badge key={skill} className="bg-amber-600">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddMentorDialog} onOpenChange={setShowAddMentorDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle>{editingMentor ? "Edit Mentor" : "Add New Mentor"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {editingMentor ? "Update mentor information" : "Add a new mentor to the platform"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Name</Label>
              <Input
                defaultValue={editingMentor?.name}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="Dr. Sarah Johnson"
              />
            </div>
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input
                type="email"
                defaultValue={editingMentor?.email}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="sarah@techmigo.com"
              />
            </div>
            <div>
              <Label className="text-gray-300">Hourly Rate</Label>
              <Input
                defaultValue={editingMentor?.hourlyRate}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="$80/hr"
              />
            </div>
            <div>
              <Label className="text-gray-300">Expertise (comma-separated)</Label>
              <Input
                defaultValue={editingMentor?.expertise.join(", ")}
                className="mt-2 border-gray-700 bg-gray-900 text-gray-100"
                placeholder="React, TypeScript, System Design"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddMentorDialog(false)} className="border-gray-700">
                Cancel
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleSaveMentor}>
                {editingMentor ? "Update Mentor" : "Add Mentor"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
