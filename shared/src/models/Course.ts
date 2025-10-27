import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  instructor: z.string(),
  price: z.number().min(0),
  category: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number(), // in hours
  thumbnail: z.string().url().optional(),
  status: z.enum(['draft', 'published', 'archived']),
  enrollmentCount: z.number().default(0),
  rating: z.number().min(0).max(5).default(0),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Course = z.infer<typeof courseSchema>;

// Mongoose schema
const CourseMongooseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  duration: { type: Number, required: true },
  thumbnail: { type: String },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  enrollmentCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  lessons: { type: Number, default: 0 },
  introVideoUrl: { type: String },
  whatYouWillLearn: [{ type: String }],
  courseCurriculum: [{
    section: { type: String },
    lectures: [{
      title: { type: String },
      duration: { type: String }
    }]
  }],
  hasCertificate: { type: Boolean, default: true },
  projectTitle: { type: String },
  projectDescription: { type: String },
  projectMedia: { type: String }
}, {
  timestamps: true,
  strict: false  // Allow fields not in schema
});

// Delete the model if it exists to avoid caching issues
if (mongoose.models.Course) {
  delete mongoose.models.Course;
}

export const CourseModel = mongoose.model('Course', CourseMongooseSchema);