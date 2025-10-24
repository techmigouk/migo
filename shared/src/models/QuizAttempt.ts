import mongoose, { Schema, Document } from 'mongoose'

export interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  answers: Array<{
    questionId: string
    answer: string | number
    isCorrect: boolean
    pointsEarned: number
  }>
  score: number
  maxScore: number
  percentage: number
  passed: boolean
  startedAt: Date
  completedAt?: Date
  timeSpent?: number // in seconds
  attemptNumber: number
  createdAt: Date
}

const QuizAttemptSchema = new Schema<IQuizAttempt>(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
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
    answers: [
      {
        questionId: String,
        answer: Schema.Types.Mixed,
        isCorrect: Boolean,
        pointsEarned: Number,
      },
    ],
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
    },
    timeSpent: {
      type: Number,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound indexes
QuizAttemptSchema.index({ userId: 1, quizId: 1, attemptNumber: 1 })
QuizAttemptSchema.index({ userId: 1, courseId: 1 })

export const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model<IQuizAttempt>('QuizAttempt', QuizAttemptSchema)
