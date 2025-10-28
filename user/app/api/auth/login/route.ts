import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@amigo/shared';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_PUBLIC_JWT_SECRET || 'techmigo-secret-key-2024';

export async function POST(request: NextRequest) {
  try {
    console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', JWT_SECRET.length);
    
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await db.connect();

    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    console.log('About to sign JWT with payload:', {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
    console.log('JWT_SECRET for signing:', JWT_SECRET ? 'Present' : 'Missing');
    
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Token generated successfully');

    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
      bio: user.bio,
      country: user.country,
      city: user.city,
      dateOfBirth: user.dateOfBirth,
      learningGoal: user.learningGoal,
      profileCompleted: user.profileCompleted,
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
      token,
    });

    // Set token in cookie as well
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}
