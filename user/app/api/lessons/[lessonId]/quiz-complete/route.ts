import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { LessonProgress } from '@/../shared/src/models/LessonProgress';
import { LessonModel } from '@amigo/shared';

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { score, passed } = body;

    await db.connect();

    // Get current lesson info to find the next lesson
    const currentLesson = await LessonModel.findById(params.lessonId);
    if (!currentLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Update current lesson progress with quiz completion
    await LessonProgress.findOneAndUpdate(
      {
        userId: user.userId,
        lessonId: params.lessonId
      },
      {
        userId: user.userId,
        lessonId: params.lessonId,
        courseId: currentLesson.courseId,
        quizCompleted: passed,
        quizScore: score,
        quizCompletedAt: passed ? new Date() : undefined,
        isUnlocked: true, // Current lesson is unlocked
      },
      {
        upsert: true,
        new: true
      }
    );

    // If quiz passed, unlock the next lesson
    if (passed) {
      // Find all lessons in this course sorted by order
      const allLessons = await LessonModel
        .find({ courseId: currentLesson.courseId })
        .sort({ order: 1 })
        .lean();

      // Find current lesson index
      const currentIndex = allLessons.findIndex((l: any) => l._id.toString() === params.lessonId);
      
      // If there's a next lesson, unlock it
      if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
        const nextLesson = allLessons[currentIndex + 1];
        
        await LessonProgress.findOneAndUpdate(
          {
            userId: user.userId,
            lessonId: (nextLesson._id as any).toString()
          },
          {
            userId: user.userId,
            lessonId: (nextLesson._id as any).toString(),
            courseId: currentLesson.courseId,
            isUnlocked: true,
          },
          {
            upsert: true,
            new: true
          }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      quizCompleted: passed,
      score,
      message: passed ? 'Quiz passed! Next lesson unlocked.' : 'Quiz completed but not passed. Try again.'
    });
  } catch (error) {
    console.error('Error completing quiz:', error);
    return NextResponse.json(
      { error: 'Failed to complete quiz' },
      { status: 500 }
    );
  }
}
