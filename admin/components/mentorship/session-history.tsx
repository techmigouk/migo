"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Star } from "lucide-react"

interface HistoricalSession {
  id: string
  mentor: string
  student: string
  topic: string
  date: string
  duration: string
  rating: number
  notes: string
}

const mockHistory: HistoricalSession[] = [
  {
    id: "1",
    mentor: "Dr. Sarah Johnson",
    student: "John Doe",
    topic: "React Hooks Deep Dive",
    date: "2024-03-10",
    duration: "1 hour",
    rating: 5,
    notes: "Excellent session, covered useState and useEffect in detail",
  },
  {
    id: "2",
    mentor: "Michael Chen",
    student: "Jane Smith",
    topic: "Python Data Analysis",
    date: "2024-03-08",
    duration: "1.5 hours",
    rating: 4.5,
    notes: "Good overview of pandas and numpy",
  },
  {
    id: "3",
    mentor: "Emily Rodriguez",
    student: "Mike Johnson",
    topic: "Design System Creation",
    date: "2024-03-05",
    duration: "2 hours",
    rating: 5,
    notes: "Comprehensive walkthrough of building a design system",
  },
]

export function SessionHistory() {
  const [history, setHistory] = useState<HistoricalSession[]>(mockHistory)
  const [mentorFilter, setMentorFilter] = useState("all")

  const filteredHistory = history.filter((session) => mentorFilter === "all" || session.mentor === mentorFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Session History</h2>
          <p className="mt-1 text-gray-400">View completed mentorship sessions</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <Select value={mentorFilter} onValueChange={setMentorFilter}>
          <SelectTrigger className="w-[200px] border-gray-700 bg-gray-800 text-gray-100">
            <SelectValue placeholder="Mentor" />
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800">
            <SelectItem value="all">All Mentors</SelectItem>
            <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
            <SelectItem value="Michael Chen">Michael Chen</SelectItem>
            <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* History Table */}
      <div className="rounded-lg border border-gray-800 bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-700/50">
              <TableHead className="text-gray-300">Session Details</TableHead>
              <TableHead className="text-gray-300">Participants</TableHead>
              <TableHead className="text-gray-300">Date & Duration</TableHead>
              <TableHead className="text-gray-300">Rating</TableHead>
              <TableHead className="text-gray-300">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((session) => (
              <TableRow key={session.id} className="border-gray-700 hover:bg-gray-700/50">
                <TableCell className="font-medium text-gray-100">{session.topic}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="text-gray-100">{session.mentor}</p>
                    <p className="text-gray-400">with {session.student}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {session.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {session.duration}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-medium text-gray-100">{session.rating}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-400 max-w-xs truncate">{session.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
