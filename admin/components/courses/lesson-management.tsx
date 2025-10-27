"use client"

import { useState } from "react"
import { CourseSelection } from "./course-selection"
import { ContextAwareLessonManager } from "./context-aware-lesson-manager"

export function LessonManagement() {
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; name: string } | null>(null)

  const handleCourseSelect = (courseId: string, courseName: string) => {
    setSelectedCourse({ id: courseId, name: courseName })
  }

  const handleBackToCourses = () => {
    setSelectedCourse(null)
  }

  if (selectedCourse) {
    return (
      <ContextAwareLessonManager
        courseId={selectedCourse.id}
        courseName={selectedCourse.name}
        onBack={handleBackToCourses}
      />
    )
  }

  return <CourseSelection onCourseSelect={handleCourseSelect} />
}
