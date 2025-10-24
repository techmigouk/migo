import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Quiz, QuizAttempt } from '@amigo/shared'
import { headers } from 'next/headers'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.substring(7)
    // TODO: Verify JWT token and extract userId
    const userId = 'placeholder-user-id'
    
    await db.connect()

    const quizId = params.id
    const body = await request.json()
    const { answers, startedAt } = body

    // Fetch the quiz with correct answers
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Check max attempts
    if (quiz.maxAttempts) {
      const previousAttempts = await QuizAttempt.countDocuments({
        quizId,
        userId,
      })
      
      if (previousAttempts >= quiz.maxAttempts) {
        return NextResponse.json(
          { error: 'Maximum attempts reached' },
          { status: 400 }
        )
      }
    }

    // Grade the quiz
    let totalScore = 0
    let maxScore = 0
    const gradedAnswers = answers.map((answer: any, index: number) => {
      const question = quiz.questions[index]
      maxScore += question.points
      
      const isCorrect = String(answer.answer) === String(question.correctAnswer)
      const pointsEarned = isCorrect ? question.points : 0
      totalScore += pointsEarned

      return {
        questionId: question._id?.toString() || index.toString(),
        answer: answer.answer,
        isCorrect,
        pointsEarned,
      }
    })

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
    const passed = percentage >= quiz.passingScore

    // Calculate attempt number
    const attemptCount = await QuizAttempt.countDocuments({
      quizId,
      userId,
    })

    // Calculate time spent
    const completedAt = new Date()
    const timeSpent = startedAt 
      ? Math.floor((completedAt.getTime() - new Date(startedAt).getTime()) / 1000)
      : 0

    // Create quiz attempt record
    const attempt = await QuizAttempt.create({
      quizId,
      userId,
      courseId: quiz.courseId,
      answers: gradedAnswers,
      score: totalScore,
      maxScore,
      percentage: Math.round(percentage * 10) / 10,
      passed,
      startedAt: startedAt ? new Date(startedAt) : completedAt,
      completedAt,
      timeSpent,
      attemptNumber: attemptCount + 1,
    })

    return NextResponse.json({
      success: true,
      attempt,
      results: {
        score: totalScore,
        maxScore,
        percentage: Math.round(percentage * 10) / 10,
        passed,
        answersCorrect: gradedAnswers.filter((a: any) => a.isCorrect).length,
        totalQuestions: quiz.questions.length,
        timeSpent,
      },
    })
  } catch (error) {
    console.error('Error submitting quiz attempt:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz attempt' },
      { status: 500 }
    )
  }
}

// Get quiz attempts for a specific quiz
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.substring(7)
    const userId = 'placeholder-user-id'
    
    await db.connect()

    const quizId = params.id

    // Fetch user's attempts for this quiz
    const attempts = await QuizAttempt.find({
      quizId,
      userId,
    })
      .sort({ attemptNumber: -1 })
      .lean()

    // Calculate best attempt
    const bestAttempt = attempts.length > 0
      ? attempts.reduce((best, current) => 
          current.percentage > best.percentage ? current : best
        )
      : null

    return NextResponse.json({
      success: true,
      attempts,
      stats: {
        totalAttempts: attempts.length,
        bestScore: bestAttempt?.percentage || 0,
        passed: bestAttempt?.passed || false,
      },
    })
  } catch (error) {
    console.error('Error fetching quiz attempts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    )
  }
}
