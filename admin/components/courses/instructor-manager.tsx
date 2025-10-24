"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, BookOpen, Users, Star } from "lucide-react"

interface Instructor {
  id: string
  name: string
  email: string
  bio: string
  expertise: string[]
  coursesCount: number
  studentsCount: number
  rating: number
}

const mockInstructors: Instructor[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@techmigo.com",
    bio: "Senior React Developer with 10+ years of experience",
    expertise: ["React", "JavaScript", "TypeScript"],
    coursesCount: 5,
    studentsCount: 3420,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@techmigo.com",
    bio: "TypeScript expert and open-source contributor",
    expertise: ["TypeScript", "Node.js", "GraphQL"],
    coursesCount: 3,
    studentsCount: 2156,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@techmigo.com",
    bio: "Data Science and Machine Learning specialist",
    expertise: ["Python", "Machine Learning", "Data Analysis"],
    coursesCount: 4,
    studentsCount: 4890,
    rating: 4.7,
  },
]

export function InstructorManager() {
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null)

  const handleAddInstructor = () => {
    console.log("[v0] Opening add instructor dialog")
    setShowAddDialog(true)
  }

  const handleViewProfile = (instructor: Instructor) => {
    console.log("[v0] Viewing instructor profile:", instructor.id)
    setSelectedInstructor(instructor)
    setShowProfileDialog(true)
  }

  const handleSaveInstructor = () => {
    console.log("[v0] Saving new instructor")
    setShowAddDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Instructor Manager</h2>
          <p className="mt-1 text-gray-400">Manage course instructors and mentors</p>
        </div>
        <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleAddInstructor}>
          <Plus className="mr-2 h-4 w-4" />
          Add Instructor
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {instructors.map((instructor) => (
          <Card key={instructor.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={`/placeholder_64px.png?height=64&width=64`} />
                  <AvatarFallback className="bg-gray-700 text-gray-300 text-lg">
                    {instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-100">{instructor.name}</h3>
                  <p className="text-sm text-gray-400">{instructor.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-400">{instructor.bio}</p>
              <div className="flex flex-wrap gap-2">
                {instructor.expertise.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-gray-600 text-gray-300">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <div className="flex items-center justify-center text-amber-500">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <p className="mt-1 text-lg font-bold text-gray-100">{instructor.coursesCount}</p>
                  <p className="text-xs text-gray-400">Courses</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-blue-500">
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="mt-1 text-lg font-bold text-gray-100">{instructor.studentsCount}</p>
                  <p className="text-xs text-gray-400">Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="mt-1 text-lg font-bold text-gray-100">{instructor.rating}</p>
                  <p className="text-xs text-gray-400">Rating</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 bg-transparent"
                onClick={() => handleViewProfile(instructor)}
              >
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Add New Instructor</DialogTitle>
            <DialogDescription className="text-gray-400">Add a new instructor to the platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Full Name</Label>
                <Input placeholder="Enter name..." className="border-gray-700 bg-gray-900 text-gray-100" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email..."
                  className="border-gray-700 bg-gray-900 text-gray-100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Bio</Label>
              <Textarea placeholder="Enter bio..." rows={3} className="border-gray-700 bg-gray-900 text-gray-100" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Expertise (comma-separated)</Label>
              <Input
                placeholder="e.g., React, JavaScript, TypeScript"
                className="border-gray-700 bg-gray-900 text-gray-100"
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 bg-amber-600 hover:bg-amber-700" onClick={handleSaveInstructor}>
                Add Instructor
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-gray-700 bg-gray-900 text-gray-100"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl border-gray-700 bg-gray-800 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Instructor Profile</DialogTitle>
          </DialogHeader>
          {selectedInstructor && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`/placeholder_64px.png?height=80&width=80`} />
                  <AvatarFallback className="bg-gray-700 text-gray-300 text-2xl">
                    {selectedInstructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-gray-100">{selectedInstructor.name}</h3>
                  <p className="text-gray-400">{selectedInstructor.email}</p>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Bio</Label>
                <p className="mt-2 text-gray-400">{selectedInstructor.bio}</p>
              </div>
              <div>
                <Label className="text-gray-300">Expertise</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedInstructor.expertise.map((skill) => (
                    <Badge key={skill} variant="outline" className="border-gray-600 text-gray-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <BookOpen className="mx-auto h-6 w-6 text-amber-500" />
                  <p className="mt-2 text-2xl font-bold text-gray-100">{selectedInstructor.coursesCount}</p>
                  <p className="text-sm text-gray-400">Courses</p>
                </div>
                <div className="text-center rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <Users className="mx-auto h-6 w-6 text-blue-500" />
                  <p className="mt-2 text-2xl font-bold text-gray-100">{selectedInstructor.studentsCount}</p>
                  <p className="text-sm text-gray-400">Students</p>
                </div>
                <div className="text-center rounded-lg border border-gray-700 bg-gray-900 p-4">
                  <Star className="mx-auto h-6 w-6 text-amber-500 fill-current" />
                  <p className="mt-2 text-2xl font-bold text-gray-100">{selectedInstructor.rating}</p>
                  <p className="text-sm text-gray-400">Rating</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
