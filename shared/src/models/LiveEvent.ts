import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const liveEventSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  instructor: z.string(),
  scheduledAt: z.date(),
  duration: z.number(), // in minutes
  meetingUrl: z.string().url().optional(),
  maxAttendees: z.number().optional(),
  attendees: z.array(z.string()).default([]),
  status: z.enum(['scheduled', 'live', 'completed', 'cancelled']),
  recordingUrl: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type LiveEvent = z.infer<typeof liveEventSchema>;

// Mongoose schema
const LiveEventMongooseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, required: true },
  meetingUrl: { type: String },
  maxAttendees: { type: Number },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['scheduled', 'live', 'completed', 'cancelled'], default: 'scheduled' },
  recordingUrl: { type: String }
}, {
  timestamps: true
});

export const LiveEventModel = mongoose.models.LiveEvent || mongoose.model('LiveEvent', LiveEventMongooseSchema);