import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const AnalyticsEventSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string(),
  eventType: z.enum([
    'page_view',
    'course_view',
    'lesson_start',
    'lesson_complete',
    'video_play',
    'video_pause',
    'video_complete',
    'quiz_start',
    'quiz_complete',
    'search',
    'enrollment',
    'purchase',
    'login',
    'logout',
    'signup',
  ]),
  eventData: z.record(z.any()).optional(),
  metadata: z.object({
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
    referrer: z.string().optional(),
    device: z.string().optional(),
    browser: z.string().optional(),
    os: z.string().optional(),
  }).optional(),
});

export type AnalyticsEventType = z.infer<typeof AnalyticsEventSchema>;

// Mongoose interface
export interface IAnalyticsEvent extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId: string;
  eventType: string;
  eventData?: Record<string, any>;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    device?: string;
    browser?: string;
    os?: string;
  };
  createdAt: Date;
}

// Mongoose schema
const AnalyticsEventMongooseSchema = new Schema<IAnalyticsEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'page_view',
        'course_view',
        'lesson_start',
        'lesson_complete',
        'video_play',
        'video_pause',
        'video_complete',
        'quiz_start',
        'quiz_complete',
        'search',
        'enrollment',
        'purchase',
        'login',
        'logout',
        'signup',
      ],
      index: true,
    },
    eventData: {
      type: Schema.Types.Mixed,
    },
    metadata: {
      userAgent: String,
      ipAddress: String,
      referrer: String,
      device: String,
      browser: String,
      os: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for analytics queries
AnalyticsEventMongooseSchema.index({ createdAt: -1 });
AnalyticsEventMongooseSchema.index({ eventType: 1, createdAt: -1 });
AnalyticsEventMongooseSchema.index({ userId: 1, createdAt: -1 });

export const AnalyticsEventModel =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>('AnalyticsEvent', AnalyticsEventMongooseSchema);