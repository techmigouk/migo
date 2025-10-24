import mongoose, { Schema, Document } from 'mongoose'

export interface IProject extends Document {
  courseId: mongoose.Types.ObjectId
  title: string
  description: string
  requirements: string[]
  dueDate?: Date
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedHours: number
  techStack: string[]
  resources: Array<{
    title: string
    url: string
    type: 'video' | 'article' | 'documentation' | 'tool'
  }>
  rubric: Array<{
    criteria: string
    points: number
    description: string
  }>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    dueDate: {
      type: Date,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    estimatedHours: {
      type: Number,
      default: 5,
    },
    techStack: {
      type: [String],
      default: [],
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ['video', 'article', 'documentation', 'tool'],
        },
      },
    ],
    rubric: [
      {
        criteria: String,
        points: Number,
        description: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema)
