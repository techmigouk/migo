import mongoose, { Document, Schema } from 'mongoose'

interface IUser extends Document {
  email: string
  password: string
  name: string
  role: 'student' | 'admin' | 'instructor'
  avatar?: string
  phone?: string
  bio?: string
  country?: string
  city?: string
  dateOfBirth?: Date
  learningGoal?: 'career' | 'upskill' | 'business'
  profileCompleted?: boolean
  profileCompletedAt?: Date
  resetToken?: string
  resetTokenExpiry?: Date
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'instructor'],
    default: 'student',
  },
  avatar: String,
  phone: String,
  bio: String,
  country: String,
  city: String,
  dateOfBirth: Date,
  learningGoal: {
    type: String,
    enum: ['career', 'upskill', 'business'],
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  profileCompletedAt: Date,
  resetToken: String,
  resetTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  },
  {
    timestamps: true, // This will automatically manage createdAt and updatedAt
  }
)

export const User = (mongoose.models.User as mongoose.Model<IUser>) || mongoose.model<IUser>('User', userSchema)