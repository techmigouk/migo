import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Certificate } from '@amigo/shared'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  try {
    // Get user ID from auth token
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.substring(7)
    // TODO: Verify JWT token and extract userId
    const userId = 'placeholder-user-id' // Extract from verified token
    
    await db.connect()

    // Fetch user's certificates
    const certificates = await Certificate.find({ userId })
      .populate('courseId', 'title thumbnail')
      .sort({ completionDate: -1 })
      .lean()

    return NextResponse.json({ certificates })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

// Create certificate (called when user completes a course)
export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.substring(7)
    const userId = 'placeholder-user-id' // Extract from verified token
    
    await db.connect()

    const body = await request.json()
    const { courseId, skills, grade, hoursCompleted } = body

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({ userId, courseId })
    if (existing) {
      return NextResponse.json(
        { error: 'Certificate already issued for this course' },
        { status: 400 }
      )
    }

    // Create certificate
    const certificate = await Certificate.create({
      userId,
      courseId,
      completionDate: new Date(),
      skills: skills || [],
      grade,
      hoursCompleted,
      issuedBy: 'TechMigo',
    })

    // TODO: Generate PDF certificate and upload to storage
    // certificate.certificateUrl = await generateCertificatePDF(certificate)
    // await certificate.save()

    return NextResponse.json({
      success: true,
      certificate,
    })
  } catch (error) {
    console.error('Error creating certificate:', error)
    return NextResponse.json(
      { error: 'Failed to create certificate' },
      { status: 500 }
    )
  }
}
