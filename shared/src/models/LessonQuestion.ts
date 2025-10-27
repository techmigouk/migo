import mongoose from 'mongoose';

interface IAnswer {
  userId: string;
  userName: string;
  answer: string;
  isAdmin: boolean;
  createdAt: Date;
}

interface ILessonQuestion extends mongoose.Document {
  courseId: string;
  lessonId?: string;
  userId: string;
  userName: string;
  question: string;
  answers: IAnswer[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonQuestionSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  lessonId: { type: String },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  question: { type: String, required: true },
  answers: [{
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    answer: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Index for faster queries
LessonQuestionSchema.index({ courseId: 1, createdAt: -1 });
LessonQuestionSchema.index({ lessonId: 1 });

export const LessonQuestion = mongoose.models.LessonQuestion || mongoose.model<ILessonQuestion>('LessonQuestion', LessonQuestionSchema);
export type { ILessonQuestion, IAnswer };
