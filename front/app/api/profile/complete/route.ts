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
    
    console.log('📋 Profile complete request received')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      console.log('❌ No authorization header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.connect()
    console.log('✅ Database connected')

    const body = await request.json()
    const { userId, name, avatar, phone, bio, country, city, dateOfBirth, learningGoal } = body

    console.log('📝 Profile data:', { userId, name, phone, country, city, dateOfBirth, learningGoal, hasAvatar: !!avatar, hasBio: !!bio })

    if (!userId) {
      console.log('❌ No userId provided')
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check required fields
    const requiredFields = { name, avatar, phone, bio, country, city, dateOfBirth, learningGoal }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields)
      return NextResponse.json({
        success: false,
        error: 'Please fill in all required fields',
        missingFields,
      }, { status: 400 })
    }

    console.log('✅ All required fields present')

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
      console.log('❌ User not found:', userId)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('✅ Profile updated successfully for user:', user.email)

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
  } catch (error: any) {
    console.error('❌ Error updating profile:', error.message || error)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { error: `Failed to update profile: ${error.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
