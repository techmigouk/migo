import mongoose, { Schema, Document } from 'mongoose'

export interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  certificateNumber: string
  completionDate: Date
  certificateUrl?: string
  skills: string[]
  grade?: string
  hoursCompleted?: number
  issuedBy: string
  createdAt: Date
}

const CertificateSchema = new Schema<ICertificate>(
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
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    certificateUrl: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    grade: {
      type: String,
    },
    hoursCompleted: {
      type: Number,
    },
    issuedBy: {
      type: String,
      default: 'TechMigo',
    },
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
CertificateSchema.index({ userId: 1, courseId: 1 }, { unique: true })

// Generate certificate number before saving
CertificateSchema.pre('save', async function (next) {
  if (!this.certificateNumber) {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    this.certificateNumber = `CERT-${year}${month}-${random}`
  }
  next()
})

export const Certificate = mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema)
