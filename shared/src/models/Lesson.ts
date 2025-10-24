import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const lessonSchema = z.object({
  courseId: z.string(),
  title: z.string().min(3),
  description: z.string(),
  content: z.string(),
  videoUrl: z.string().url().optional(),
  duration: z.number(), // in minutes
  order: z.number(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    type: z.enum(['pdf', 'video', 'link', 'document'])
  })).optional(),
  isPreview: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Lesson = z.infer<typeof lessonSchema>;

// Mongoose schema
const LessonMongooseSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: Number, required: true },
  order: { type: Number, required: true },
  resources: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['pdf', 'video', 'link', 'document'], required: true }
  }],
  isPreview: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const LessonModel = mongoose.models.Lesson || mongoose.model('Lesson', LessonMongooseSchema);