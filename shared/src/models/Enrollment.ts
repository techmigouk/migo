import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const enrollmentSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  progress: z.number().min(0).max(100).default(0),
  completedLessons: z.array(z.string()).default([]),
  lastAccessedAt: z.date(),
  enrolledAt: z.date(),
  completedAt: z.date().optional(),
  status: z.enum(['active', 'completed', 'cancelled']),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Enrollment = z.infer<typeof enrollmentSchema>;

// Mongoose schema
const EnrollmentMongooseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  lastAccessedAt: { type: Date, default: Date.now },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
}, {
  timestamps: true
});

// Index for faster queries
EnrollmentMongooseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const EnrollmentModel = mongoose.models.Enrollment || mongoose.model('Enrollment', EnrollmentMongooseSchema);