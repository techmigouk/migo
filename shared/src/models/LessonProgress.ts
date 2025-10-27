import mongoose, { Schema, Document } from 'mongoose'

export interface ILessonProgress extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  lessonId: mongoose.Types.ObjectId
  isCompleted: boolean
  completedAt?: Date
  timeSpent: number // in minutes
  lastPosition: number // video position in seconds
  notes?: string
  bookmarked: boolean
  quizCompleted?: boolean
  quizScore?: number
  quizCompletedAt?: Date
  isUnlocked?: boolean
}

const LessonProgressSchema = new Schema<ILessonProgress>(
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
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    lastPosition: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
    },
    bookmarked: {
      type: Boolean,
      default: false,
    },
    quizCompleted: {
      type: Boolean,
      default: false,
    },
    quizScore: {
      type: Number,
    },
    quizCompletedAt: {
      type: Date,
    },
    isUnlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Compound indexes for efficient querying
LessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true })
LessonProgressSchema.index({ userId: 1, courseId: 1 })
LessonProgressSchema.index({ userId: 1, isCompleted: 1 })

export const LessonProgress = mongoose.models.LessonProgress || mongoose.model<ILessonProgress>('LessonProgress', LessonProgressSchema)
