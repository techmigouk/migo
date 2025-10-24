import mongoose from 'mongoose';
import { z } from 'zod';

// Zod schema for validation
export const paymentSchema = z.object({
  userId: z.string(),
  courseId: z.string().optional(),
  amount: z.number().min(0),
  currency: z.string().default('USD'),
  status: z.enum(['pending', 'completed', 'failed', 'refunded']),
  paymentMethod: z.string(),
  transactionId: z.string(),
  subscriptionId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Payment = z.infer<typeof paymentSchema>;

// Mongoose schema
const PaymentMongooseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], required: true },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  subscriptionId: { type: String }
}, {
  timestamps: true
});

export const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', PaymentMongooseSchema);