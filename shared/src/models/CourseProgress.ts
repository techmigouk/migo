import mongoose, { Schema, Document } from 'mongoose'

export interface ICourseProgress extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  status: 'not-started' | 'in-progress' | 'completed'
  progressPercentage: number
  enrollmentDate: Date
  lastAccessedDate: Date
  completionDate?: Date
  totalTimeSpent: number // in minutes
  lessonsCompleted: number
  totalLessons: number
  quizScore?: number
  certificateIssued: boolean
}

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started',
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    lastAccessedDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
    },
    lessonsCompleted: {
      type: Number,
      default: 0,
    },
    totalLessons: {
      type: Number,
      default: 0,
    },
    quizScore: {
      type: Number,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index for efficient querying
CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true })
CourseProgressSchema.index({ userId: 1, status: 1 })

export const CourseProgress = mongoose.models.CourseProgress || mongoose.model<ICourseProgress>('CourseProgress', CourseProgressSchema)
