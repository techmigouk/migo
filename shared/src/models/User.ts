import mongoose from 'mongoose';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

// Zod schema for validation
export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(['user', 'admin', 'instructor']),
  isEmailVerified: z.boolean().default(false),
  avatar: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// TypeScript type derived from Zod schema
export type User = z.infer<typeof userSchema>;

// Mongoose schema
const UserMongooseSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin', 'instructor'], default: 'user' },
  isEmailVerified: { type: Boolean, default: false },
  avatar: { type: String },
  phone: { type: String },
  bio: { type: String },
  country: { type: String },
  city: { type: String },
  dateOfBirth: { type: Date },
  learningGoal: { type: String, enum: ['career', 'upskill', 'business'] },
  profileCompleted: { type: Boolean, default: false },
  profileCompletedAt: { type: Date },
  notificationPrefs: {
    courseUpdates: { type: Boolean, default: true },
    mentorshipMessages: { type: Boolean, default: true },
    communityMentions: { type: Boolean, default: true },
    billingNotifications: { type: Boolean, default: true }
  },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpires: { type: Date, select: false }
}, {
  timestamps: true
});

// Hash password before saving
UserMongooseSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserMongooseSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Method to check if profile is complete
UserMongooseSchema.methods.isProfileComplete = function(): boolean {
  const requiredFields = [
    this.name,
    this.email,
    this.avatar,
    this.phone,
    this.bio,
    this.country,
    this.city,
    this.dateOfBirth,
    this.learningGoal
  ];
  
  return requiredFields.every(field => field !== null && field !== undefined && field !== '');
};

// Export the Mongoose model
export const UserModel = mongoose.models.User || mongoose.model('User', UserMongooseSchema);