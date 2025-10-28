"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { BookOpen, Loader2 } from "lucide-react"
import { useAdminAuth } from "@/lib/auth-context"
import { ContextAwareLessonManager } from "./context-aware-lesson-manager"


interface Course {
  _id: string
  title: string
  category: string
  status: string
  lessons?: number
}

export function LessonManager() {
  const { adminToken } = useAdminAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  useEffect(() => {
    fetchCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      console.log('🔄 Fetching courses...')
      const response = await fetch('/api/courses', {
        headers: {
          'Authorization': `Bearer ${adminToken || ''}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('📦 Courses response:', data)
      
      if (data.courses) {
        console.log('✅ Received', data.courses.length, 'courses')
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('❌ Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  // If a course is selected, show the Context-Aware Lesson Manager
  if (selectedCourse) {
    return (
      <ContextAwareLessonManager
        courseId={selectedCourse._id}
        courseName={selectedCourse.title}
        onBack={() => setSelectedCourse(null)}
      />
    )
  }

  // Show course selection view
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-100">Lesson Manager</h2>
        <p className="mt-1 text-gray-400">Select a course to manage its lessons</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : courses.length === 0 ? (
        <Card className="border-gray-700 bg-gray-800">
          <CardHeader>
            <div className="py-12 text-center">
              <p className="text-gray-400">No courses found</p>
              <p className="mt-2 text-sm text-gray-500">Create a course first to manage lessons</p>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card 
              key={course._id} 
              className="border-gray-700 bg-gray-800 hover:border-amber-600 cursor-pointer transition-colors" 
              onClick={() => setSelectedCourse(course)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-100">{course.title}</h3>
                    <p className="mt-1 text-sm text-gray-400">{course.category}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="border-amber-600 text-amber-500">
                        {course.lessons || 0} Lessons
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={
                          course.status === 'published' 
                            ? 'border-green-600 text-green-500' 
                            : 'border-gray-600 text-gray-400'
                        }
                      >
                        {course.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button className="mt-4 w-full bg-amber-600 hover:bg-amber-700">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Lessons
                </Button>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
