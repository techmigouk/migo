import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { LessonQuestion } from '@/../shared/src/models/LessonQuestion';

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string; questionId: string } }
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
    const { answer } = body;

    if (!answer) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 });
    }

    await db.connect();

    const newAnswer = {
      userId: user.userId,
      userName: user.name || 'Anonymous',
      answer,
      isAdmin: user.role === 'admin' || false,
      createdAt: new Date(),
    };

    // Update question with new answer using Mongoose
    const question = await LessonQuestion.findByIdAndUpdate(
      params.questionId,
      {
        $push: { answers: newAnswer },
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error posting answer:', error);
    return NextResponse.json(
      { error: 'Failed to post answer' },
      { status: 500 }
    );
  }
}
