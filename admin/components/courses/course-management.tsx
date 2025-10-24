"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseLibrary } from "./course-library"
import { LessonManager } from "./lesson-manager"
import { QuizManager } from "./quiz-manager"
import { MediaLibrary } from "./media-library"
import { InstructorManager } from "./instructor-manager"
import { SubmittedProjects } from "./submitted-projects"

export function CourseManagement() {
  const [activeTab, setActiveTab] = useState("courses")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Course Management</h1>
        <p className="mt-2 text-gray-400">Create, manage, and optimize your learning content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="courses">Course Library</TabsTrigger>
          <TabsTrigger value="submitted-projects">Submitted Projects</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="media">Media Library</TabsTrigger>
          <TabsTrigger value="instructors">Instructors</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          <CourseLibrary />
        </TabsContent>

        <TabsContent value="submitted-projects" className="mt-6">
          <SubmittedProjects />
        </TabsContent>

        <TabsContent value="lessons" className="mt-6">
          <LessonManager />
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          <QuizManager />
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <MediaLibrary />
        </TabsContent>

        <TabsContent value="instructors" className="mt-6">
          <InstructorManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
