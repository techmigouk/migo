import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@amigo/shared';
import { db } from '@/lib/db';

// GET all instructors
export async function GET() {
  try {
    await db.connect();
    const instructors = await UserModel.find({ role: 'instructor' })
      .select('name email avatar bio position expertise createdAt')
      .sort({ name: 1 })
      .lean();
    
    return NextResponse.json({ success: true, data: instructors });
  } catch (error: any) {
    console.error('Error fetching instructors:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch instructors' },
      { status: 500 }
    );
  }
}

// POST create new instructor
export async function POST(request: NextRequest) {
  try {
    await db.connect();
    const body = await request.json();
    
    console.log('Creating instructor:', body);
    
    // Ensure role is set to instructor
    const instructorData = {
      ...body,
      role: 'instructor',
      isEmailVerified: true, // Auto-verify admin-created instructors
    };
    
    const instructor = new UserModel(instructorData);
    await instructor.save();
    
    console.log('Instructor created successfully:', instructor._id);
    
    // Return without password
    const { password, ...instructorWithoutPassword } = instructor.toObject();
    
    return NextResponse.json({ success: true, data: instructorWithoutPassword }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating instructor:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create instructor' },
      { status: 500 }
    );
  }
}
