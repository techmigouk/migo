import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
// TODO: QuestionModel needs to be created in shared package

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    await db.connect();

    const { lessonId } = await params;

    // TODO: Implement QuestionModel in shared package
    // For now, return empty array
    const questions: any[] = [];

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
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    await db.connect();

    const { lessonId } = await params;
    const body = await request.json();

    // TODO: Implement QuestionModel in shared package
    // For now, return mock response
    const question = {
      _id: 'mock-id',
      lessonId,
      ...body
    };

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question' },
      { status: 500 }
    );
  }
}
