import mongoose, { Schema, Document } from 'mongoose'

export interface IProjectSubmission extends Document {
  projectId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  title: string
  description: string
  repositoryUrl?: string
  liveUrl?: string
  videoUrl?: string
  screenshots: string[]
  status: 'draft' | 'submitted' | 'under-review' | 'reviewed' | 'approved' | 'rejected'
  submittedAt?: Date
  reviewedAt?: Date
  reviewedBy?: mongoose.Types.ObjectId
  feedback?: string
  score?: number
  maxScore?: number
  rubricScores?: Array<{
    criteria: string
    pointsEarned: number
    maxPoints: number
    feedback: string
  }>
  createdAt: Date
  updatedAt: Date
}

const ProjectSubmissionSchema = new Schema<IProjectSubmission>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
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
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    repositoryUrl: {
      type: String,
    },
    liveUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    screenshots: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under-review', 'reviewed', 'approved', 'rejected'],
      default: 'draft',
      index: true,
    },
    submittedAt: {
      type: Date,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    feedback: {
      type: String,
    },
    score: {
      type: Number,
    },
    maxScore: {
      type: Number,
    },
    rubricScores: [
      {
        criteria: String,
        pointsEarned: Number,
        maxPoints: Number,
        feedback: String,
      },
    ],
  },
  {
    timestamps: true,
  }
)

// Compound indexes
ProjectSubmissionSchema.index({ userId: 1, projectId: 1 })
ProjectSubmissionSchema.index({ userId: 1, status: 1 })
ProjectSubmissionSchema.index({ courseId: 1, status: 1 })

export const ProjectSubmission = mongoose.models.ProjectSubmission || mongoose.model<IProjectSubmission>('ProjectSubmission', ProjectSubmissionSchema)
