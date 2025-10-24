import { Course } from "../models/Course"
import { DatabaseService } from "../lib/database"
import { ObjectId } from "mongodb"

export class CourseService extends DatabaseService<Course> {
  constructor() {
    super("courses")
  }

  async findBySlug(slug: string): Promise<Course | null> {
    return this.findOne({ slug } as any)
  }

  async findByInstructor(instructorId: string | ObjectId): Promise<Course[]> {
    return this.find({ instructor: new ObjectId(instructorId) } as any)
  }

  async addLesson(
    courseId: string | ObjectId,
    sectionIndex: number,
    lesson: Omit<Course['curriculum']['sections'][0]['lessons'][0], '_id'>
  ): Promise<Course | null> {
    return this.update(courseId, {
      $push: {
        [`curriculum.sections.${sectionIndex}.lessons`]: {
          _id: new ObjectId(),
          ...lesson
        }
      }
    } as any)
  }

  async updateLesson(
    courseId: string | ObjectId,
    sectionIndex: number,
    lessonId: string | ObjectId,
    lessonData: Partial<Course['curriculum']['sections'][0]['lessons'][0]>
  ): Promise<Course | null> {
    const _id = new ObjectId(lessonId)
    return this.update(courseId, {
      $set: {
        [`curriculum.sections.${sectionIndex}.lessons.$[lesson]`]: {
          ...lessonData,
          _id
        }
      }
    } as any)
  }

  async updateStats(
    courseId: string | ObjectId,
    stats: Partial<Course['stats']>
  ): Promise<Course | null> {
    return this.update(courseId, { stats } as any)
  }

  async addRating(
    courseId: string | ObjectId,
    rating: number
  ): Promise<Course | null> {
    const updateData = {
      $inc: {
        'stats.ratings.count': 1,
        [`stats.ratings.distribution.${rating}`]: 1
      },
      $set: {
        'stats.ratings.average': await this.calculateNewAverage(courseId, rating)
      }
    }

    return this.update(courseId, updateData as any)
  }

  private async calculateNewAverage(courseId: string | ObjectId, newRating: number): Promise<number> {
    const course = await this.findOne({ _id: new ObjectId(courseId) } as any)
    if (!course?.stats?.ratings) return newRating

    const { count, average } = course.stats.ratings
    return ((average * count) + newRating) / (count + 1)
  }
}