import { User } from "../models/User"
import { DatabaseService } from "../lib/database"
import { ObjectId } from "mongodb"

export class UserService extends DatabaseService<User> {
  constructor() {
    super("users")
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email } as any)
  }

  async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.create(userData)
  }

  async updateProfile(userId: string | ObjectId, profileData: Partial<User['profile']>): Promise<User | null> {
    return this.update(userId, { profile: profileData } as any)
  }

  async updateProgress(userId: string | ObjectId, courseId: string | ObjectId, lessonId: string | ObjectId): Promise<User | null> {
    const progress = {
      courseId: new ObjectId(courseId),
      completedLessons: [new ObjectId(lessonId)],
      lastAccessed: new Date()
    }

    return this.update(userId, {
      $push: { progress },
      $addToSet: { 'progress.completedLessons': new ObjectId(lessonId) }
    } as any)
  }

  async enrollInCourse(userId: string | ObjectId, courseId: string | ObjectId): Promise<User | null> {
    return this.update(userId, {
      $addToSet: { enrolledCourses: new ObjectId(courseId) }
    } as any)
  }

  async completeCourse(userId: string | ObjectId, courseId: string | ObjectId): Promise<User | null> {
    return this.update(userId, {
      $addToSet: { completedCourses: new ObjectId(courseId) },
      $pull: { enrolledCourses: new ObjectId(courseId) }
    } as any)
  }

  async updatePreferences(userId: string | ObjectId, preferences: Partial<User['preferences']>): Promise<User | null> {
    return this.update(userId, { preferences } as any)
  }
}