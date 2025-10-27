import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const CourseReviewSchema = z.object({
  courseId: z.string(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
  createdAt: z.date().optional(),
  helpful: z.array(z.string()).default([]), // userIds who found this helpful
});

export type CourseReviewType = z.infer<typeof CourseReviewSchema>;

// Mongoose interface
export interface ICourseReview extends Document {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: mongoose.Types.ObjectId[];
}

// Mongoose schema
const reviewSchema = new Schema<ICourseReview>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
      minlength: 10,
      maxlength: 1000,
    },
    helpful: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index - user can only review once per course
reviewSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const CourseReviewModel =
  mongoose.models.CourseReview ||
  mongoose.model<ICourseReview>('CourseReview', reviewSchema);
