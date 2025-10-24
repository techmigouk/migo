import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { User } from '@/lib/models/user'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.substring(7)
    // TODO: Verify JWT and extract userId
    // For now, get user from localStorage on client side
    
    await db.connect()

    // This will be called with userId in the future
    // For now, return structure
    return NextResponse.json({
      success: true,
      profileComplete: false,
      missingFields: [],
    })
  } catch (error) {
    console.error('Error checking profile:', error)
    return NextResponse.json(
      { error: 'Failed to check profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.connect()

    const body = await request.json()
    const { userId, name, avatar, phone, bio, country, city, dateOfBirth, learningGoal } = body

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check required fields
    const requiredFields = { name, avatar, phone, bio, country, city, dateOfBirth, learningGoal }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Please fill in all required fields',
        missingFields,
      }, { status: 400 })
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        avatar,
        phone,
        bio,
        country,
        city,
        dateOfBirth: new Date(dateOfBirth),
        learningGoal,
        profileCompleted: true,
        profileCompletedAt: new Date(),
      },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Profile completed successfully!',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        country: user.country,
        city: user.city,
        dateOfBirth: user.dateOfBirth,
        learningGoal: user.learningGoal,
        profileCompleted: user.profileCompleted,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
