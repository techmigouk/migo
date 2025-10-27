import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@amigo/shared';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET user's wishlist
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await db.connect();

    const user = await UserModel.findById(decoded.userId)
      .populate('wishlist')
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: (user as any).wishlist || [],
    });
  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST add course to wishlist
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    await db.connect();

    const user = await UserModel.findByIdAndUpdate(
      decoded.userId,
      { $addToSet: { wishlist: courseId } },
      { new: true }
    ).populate('wishlist');

    return NextResponse.json({
      success: true,
      data: user?.wishlist || [],
      message: 'Course added to wishlist',
    });
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE remove course from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    await db.connect();

    const user = await UserModel.findByIdAndUpdate(
      decoded.userId,
      { $pull: { wishlist: courseId } },
      { new: true }
    ).populate('wishlist');

    return NextResponse.json({
      success: true,
      data: user?.wishlist || [],
      message: 'Course removed from wishlist',
    });
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}
