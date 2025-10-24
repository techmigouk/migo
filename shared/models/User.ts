import { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: "student" | "instructor" | "admin"
  createdAt: Date
  updatedAt: Date
  profile?: {
    bio?: string
    avatar?: string
    socialLinks?: {
      twitter?: string
      linkedin?: string
      github?: string
    }
  }
  enrolledCourses?: ObjectId[]
  completedCourses?: ObjectId[]
  progress?: {
    courseId: ObjectId
    completedLessons: ObjectId[]
    lastAccessed: Date
  }[]
  preferences?: {
    emailNotifications: boolean
    theme: "light" | "dark" | "system"
    language: string
  }
}