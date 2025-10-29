import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/lib/db';
import { UserModel } from '@amigo/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No authorization header or invalid format');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified:', { userId: decoded.userId, email: decoded.email });
    } catch (err: any) {
      console.error('❌ Token verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get update data
    const body = await request.json();
    const { avatar, name, email, phone, learningGoal, notificationPrefs } = body;
    
    console.log('📝 Update data:', { avatar: avatar ? 'provided' : 'none', name, email, phone, learningGoal });

    // Connect to database
    await db.connect();

    // Update user
    const updateData: any = {};
    if (avatar) updateData.avatar = avatar;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (learningGoal) updateData.learningGoal = learningGoal;
    if (notificationPrefs) updateData.notificationPrefs = notificationPrefs;

    console.log('🔄 Updating user:', decoded.userId);

    const user = await UserModel.findByIdAndUpdate(
      decoded.userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      console.error('❌ User not found:', decoded.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ User updated successfully');

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      }
    });

  } catch (error: any) {
    console.error('❌ Update profile error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
