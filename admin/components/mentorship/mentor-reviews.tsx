"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star } from "lucide-react"

interface Review {
  id: string
  mentor: string
  student: string
  rating: number
  comment: string
  sessionTopic: string
  date: string
}

const mockReviews: Review[] = [
  {
    id: "1",
    mentor: "Dr. Sarah Johnson",
    student: "John Doe",
    rating: 5,
    comment: "Excellent mentor! Very knowledgeable and patient. Helped me understand React hooks thoroughly.",
    sessionTopic: "React Hooks Deep Dive",
    date: "2024-03-10",
  },
  {
    id: "2",
    mentor: "Michael Chen",
    student: "Jane Smith",
    rating: 4.5,
    comment: "Great session on Python data analysis. Would recommend to anyone learning data science.",
    sessionTopic: "Python Data Analysis",
    date: "2024-03-08",
  },
  {
    id: "3",
    mentor: "Emily Rodriguez",
    student: "Mike Johnson",
    rating: 5,
    comment: "Amazing design mentor! Learned so much about creating design systems from scratch.",
    sessionTopic: "Design System Creation",
    date: "2024-03-05",
  },
]

export function MentorReviews() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [mentorFilter, setMentorFilter] = useState("all")

  const filteredReviews = reviews.filter((review) => mentorFilter === "all" || review.mentor === mentorFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Mentor Reviews</h2>
          <p className="mt-1 text-gray-400">Student feedback and ratings for mentors</p>
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

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="border-gray-700 bg-gray-800">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-700 text-gray-300">
                      {review.student
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-100">{review.student}</p>
                    <p className="text-sm text-gray-400">Session with {review.mentor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                  <span className="text-lg font-bold text-gray-100">{review.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {review.sessionTopic}
              </Badge>
              <p className="text-sm text-gray-300">{review.comment}</p>
              <p className="text-xs text-gray-500">{review.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
