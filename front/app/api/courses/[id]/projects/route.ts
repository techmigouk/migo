import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Project } from '@amigo/shared'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect()

    const courseId = params.id

    // Fetch active projects for this course
    const projects = await Project.find({ 
      courseId, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      projects,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
