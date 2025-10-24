import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const subscriptionSchema = z.object({
  userId: z.string(),
  plan: z.enum(['free', 'monthly', 'annual', 'lifetime', 'basic', 'premium', 'enterprise']),
  status: z.enum(['active', 'cancelled', 'expired', 'trial']),
  startDate: z.date(),
  endDate: z.date(),
  autoRenew: z.boolean().default(true),
  paymentMethodId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Subscription = z.infer<typeof subscriptionSchema>;

// Mongoose schema
const SubscriptionMongooseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  plan: { type: String, enum: ['free', 'monthly', 'annual', 'lifetime', 'basic', 'premium', 'enterprise'], required: true },
  status: { type: String, enum: ['active', 'cancelled', 'expired', 'trial'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  autoRenew: { type: Boolean, default: true },
  paymentMethodId: { type: String }
}, {
  timestamps: true
});

export const SubscriptionModel = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionMongooseSchema);