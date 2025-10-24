import { ObjectId } from "mongodb"

export interface Course {
  _id?: ObjectId
  title: string
  slug: string
  description: string
  thumbnail: string
  instructor: ObjectId
  price: number
  duration: number // in minutes
  level: "beginner" | "intermediate" | "advanced"
  tags: string[]
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  status: "draft" | "published" | "archived"
  curriculum: {
    sections: {
      title: string
      description?: string
      lessons: {
        _id?: ObjectId
        title: string
        description?: string
        duration: number
        type: "video" | "article" | "quiz"
        content: string
        resources?: {
          title: string
          url: string
          type: string
        }[]
        order: number
      }[]
      order: number
    }[]
  }
  requirements?: string[]
  objectives?: string[]
  stats?: {
    enrollments: number
    completions: number
    ratings: {
      average: number
      count: number
      distribution: {
        1: number
        2: number
        3: number
        4: number
        5: number
      }
    }
  }
}