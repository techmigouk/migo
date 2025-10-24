import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Quiz } from '@amigo/shared'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect()

    const courseId = params.id

    // Fetch active quizzes for this course
    const quizzes = await Quiz.find({ 
      courseId, 
      isActive: true 
    })
      .select('-questions.correctAnswer') // Don't send correct answers to client
      .sort({ createdAt: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      quizzes,
    })
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}
