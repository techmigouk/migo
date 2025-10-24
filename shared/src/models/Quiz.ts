import mongoose, { Schema, Document } from 'mongoose'

export interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId
  lessonId?: mongoose.Types.ObjectId
  title: string
  description: string
  questions: Array<{
    questionText: string
    type: 'multiple-choice' | 'true-false' | 'short-answer'
    options?: string[]
    correctAnswer: string | number
    explanation?: string
    points: number
  }>
  passingScore: number
  timeLimit?: number // in minutes
  maxAttempts?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const QuizSchema = new Schema<IQuiz>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        type: {
          type: String,
          enum: ['multiple-choice', 'true-false', 'short-answer'],
          required: true,
        },
        options: [String],
        correctAnswer: Schema.Types.Mixed,
        explanation: String,
        points: { type: Number, default: 1 },
      },
    ],
    passingScore: {
      type: Number,
      default: 70,
    },
    timeLimit: {
      type: Number,
    },
    maxAttempts: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Quiz = mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema)
