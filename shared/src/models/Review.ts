import mongoose, { Schema, Document } from 'mongoose'

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  rating: number
  comment: string
  helpfulVotes: number
  reportedCount: number
  isVerifiedPurchase: boolean
  isHidden: boolean
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    reportedCount: {
      type: Number,
      default: 0,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Compound index - one review per user per course
ReviewSchema.index({ userId: 1, courseId: 1 }, { unique: true })
ReviewSchema.index({ courseId: 1, isHidden: 1, createdAt: -1 })

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)
