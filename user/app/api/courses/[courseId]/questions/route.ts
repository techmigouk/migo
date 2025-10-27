import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { LessonQuestion } from '@/../shared/src/models/LessonQuestion';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.connect();
    
    const { courseId } = await params;
    
    // Fetch questions for this course using Mongoose model
    const questions = await LessonQuestion
      .find({ courseId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
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
    const { question, lessonId } = body;

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    await db.connect();
    
    const { courseId } = await params;

    const newQuestion = await LessonQuestion.create({
      courseId,
      lessonId: lessonId || undefined,
      userId: user.userId,
      userName: user.name || 'Anonymous',
      question,
      answers: [],
    });

    // TODO: Send notification to admin
    // You can implement this using your notification system

    return NextResponse.json(newQuestion.toObject(), { status: 201 });
  } catch (error) {
    console.error('Error posting question:', error);
    return NextResponse.json(
      { error: 'Failed to post question' },
      { status: 500 }
    );
  }
}
