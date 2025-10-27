"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { BookOpen, Loader2, GraduationCap, Clock, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Course {
  _id: string
  title: string
  description: string
  price: number
  thumbnailUrl?: string
  duration?: number
  level?: string
  studentsEnrolled?: number
}

interface CourseSelectionProps {
  onCourseSelect: (courseId: string, courseName: string) => void
}

export function CourseSelection({ onCourseSelect }: CourseSelectionProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError("")
      
      const response = await fetch('/api/courses')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch courses')
      }
      
      // Handle both { courses: [...] } and direct array response
      const coursesArray = data.courses || data
      setCourses(coursesArray)
      
      // Fetch lesson counts for each course
      const counts: Record<string, number> = {}
      await Promise.all(
        coursesArray.map(async (course: Course) => {
          try {
            const lessonResponse = await fetch(`/api/courses/${course._id}/lessons`)
            const lessonData = await lessonResponse.json()
            counts[course._id] = lessonData.length || 0
          } catch (err) {
            counts[course._id] = 0
          }
        })
      )
      setLessonCounts(counts)
      
    } catch (err: any) {
      console.error('Error fetching courses:', err)
      setError(err.message || 'Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleManageCourse = (course: Course) => {
    onCourseSelect(course._id, course.title)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-sm text-gray-400">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="bg-red-900/20 border-red-700 text-red-300">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <GraduationCap className="h-16 w-16 mx-auto text-gray-600" />
          <h3 className="text-xl font-semibold text-gray-300">No Courses Yet</h3>
          <p className="text-sm text-gray-400 max-w-md">
            Create your first course to start adding lessons. Courses are the foundation for organizing your learning content.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Create First Course
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Select a Course</h2>
          <p className="text-sm text-gray-400 mt-1">
            Choose a course to manage its lessons
          </p>
        </div>
        <Badge variant="outline" className="text-gray-300">
          {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card 
            key={course._id} 
            className="bg-gray-800/50 border-gray-700 hover:border-blue-600 transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/20"
          >
            <CardHeader>
              <div className="space-y-3">
                {/* Course Thumbnail */}
                {course.thumbnailUrl ? (
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-gray-900">
                    <img 
                      src={course.thumbnailUrl} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 rounded-lg bg-linear-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                    <GraduationCap className="h-16 w-16 text-blue-400/50" />
                  </div>
                )}

                {/* Course Title */}
                <CardTitle className="text-lg text-white line-clamp-2">
                  {course.title}
                </CardTitle>

                {/* Course Description */}
                {course.description && (
                  <CardDescription className="text-sm text-gray-400 line-clamp-3">
                    {course.description}
                  </CardDescription>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Course Metadata */}
              <div className="flex flex-wrap gap-2">
                {/* Lesson Count Badge */}
                <Badge 
                  variant="outline" 
                  className={`
                    ${lessonCounts[course._id] > 0 
                      ? 'bg-blue-900/30 border-blue-700 text-blue-300' 
                      : 'bg-gray-800 border-gray-600 text-gray-400'
                    }
                  `}
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  {lessonCounts[course._id] || 0} {lessonCounts[course._id] === 1 ? 'Lesson' : 'Lessons'}
                </Badge>

                {/* Price Badge */}
                {course.price > 0 && (
                  <Badge variant="outline" className="bg-green-900/30 border-green-700 text-green-300">
                    ${course.price}
                  </Badge>
                )}

                {/* Duration Badge */}
                {course.duration && (
                  <Badge variant="outline" className="bg-purple-900/30 border-purple-700 text-purple-300">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.duration}h
                  </Badge>
                )}

                {/* Students Enrolled */}
                {course.studentsEnrolled !== undefined && (
                  <Badge variant="outline" className="bg-amber-900/30 border-amber-700 text-amber-300">
                    <Users className="h-3 w-3 mr-1" />
                    {course.studentsEnrolled}
                  </Badge>
                )}

                {/* Level Badge */}
                {course.level && (
                  <Badge variant="outline" className="bg-gray-800 border-gray-600 text-gray-300">
                    {course.level}
                  </Badge>
                )}
              </div>

              {/* Manage Lessons Button */}
              <Button
                onClick={() => handleManageCourse(course)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Manage Lessons
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
