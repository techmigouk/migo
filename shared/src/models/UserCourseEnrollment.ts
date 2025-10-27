import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const UserCourseEnrollmentSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  enrolledAt: z.date().optional(),
  lastAccessedLessonId: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  status: z.enum(['active', 'completed', 'paused', 'dropped']).default('active'),
  completedLessons: z.array(z.string()).default([]),
  quizScores: z.record(z.number()).default({}), // lessonId -> score
  lastAccessedAt: z.date().optional(),
});

export type UserCourseEnrollmentType = z.infer<typeof UserCourseEnrollmentSchema>;

// Mongoose interface
export interface IUserCourseEnrollment extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  enrolledAt: Date;
  lastAccessedLessonId?: mongoose.Types.ObjectId;
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'dropped';
  completedLessons: mongoose.Types.ObjectId[];
  quizScores: Map<string, number>;
  lastAccessedAt?: Date;
}

// Mongoose schema
const enrollmentSchema = new Schema<IUserCourseEnrollment>(
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
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    lastAccessedLessonId: {
      type: Schema.Types.ObjectId,
      ref: 'Lesson',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'dropped'],
      default: 'active',
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    quizScores: {
      type: Map,
      of: Number,
      default: {},
    },
    lastAccessedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const UserCourseEnrollmentModel =
  mongoose.models.UserCourseEnrollment ||
  mongoose.model<IUserCourseEnrollment>('UserCourseEnrollment', enrollmentSchema);
