import { ObjectId } from "mongodb"

export interface LiveEvent {
  _id?: ObjectId
  title: string
  description: string
  instructor: ObjectId
  date: Date
  duration: number // in minutes
  type: "webinar" | "workshop" | "qa-session" | "coding-challenge"
  status: "scheduled" | "live" | "completed" | "cancelled"
  maxParticipants?: number
  registeredParticipants: ObjectId[]
  waitlist: ObjectId[]
  prerequisites?: string[]
  materials?: {
    title: string
    url: string
    type: string
  }[]
  recording?: {
    url: string
    duration: number
    uploadedAt: Date
  }
  price?: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
  meetingUrl?: string
  chatEnabled: boolean
  feedback?: {
    userId: ObjectId
    rating: number
    comment: string
    createdAt: Date
  }[]
}