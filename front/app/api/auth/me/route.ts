import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UserModel, authUtils } from '@amigo/shared';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const payload = authUtils.verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Connect to database
    await db.connect();

    // Get user from database
    const user = await UserModel.findById(payload.userId).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        country: user.country,
        city: user.city,
        dateOfBirth: user.dateOfBirth,
        learningGoal: user.learningGoal,
        profileCompleted: user.profileCompleted,
        profileCompletedAt: user.profileCompletedAt,
        notificationPrefs: user.notificationPrefs,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/auth/me - Request received')
    
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('PUT /api/auth/me - No token provided')
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    console.log('PUT /api/auth/me - Token:', token.substring(0, 20) + '...')
    
    // Verify token
    const payload = authUtils.verifyToken(token);
    
    if (!payload) {
      console.log('PUT /api/auth/me - Invalid token')
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    console.log('PUT /api/auth/me - Token verified for user:', payload.userId)

    // Get update data from request body
    const body = await request.json();
    const { name, email, avatar, phone, learningGoal, notificationPrefs } = body;

    console.log('PUT /api/auth/me - Update data:', { name, email, phone, learningGoal, hasAvatar: !!avatar, notificationPrefs })

    // Connect to database
    await db.connect();
    console.log('PUT /api/auth/me - Database connected')

    // Update user in database
    const user = await UserModel.findByIdAndUpdate(
      payload.userId,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(avatar !== undefined && { avatar }),
        ...(phone !== undefined && { phone }),
        ...(learningGoal && { learningGoal }),
        ...(notificationPrefs && { notificationPrefs }),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      console.log('PUT /api/auth/me - User not found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    console.log('PUT /api/auth/me - User updated successfully:', user._id)

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        phone: user.phone,
        learningGoal: user.learningGoal,
        notificationPrefs: user.notificationPrefs,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('PUT /api/auth/me - Error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500, headers: corsHeaders }
    );
  }
}