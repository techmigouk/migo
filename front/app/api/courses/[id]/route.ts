import { NextRequest, NextResponse } from 'next/server';
import { CourseModel, LessonModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET single course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect();
    
    // Check if admin is requesting (can see any status)
    const authHeader = request.headers.get('authorization');
    let isAdmin = false;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = authUtils.verifyToken(token);
      isAdmin = payload?.role === 'admin' || payload?.role === 'instructor';
    }
    
    const query: any = { _id: params.id };
    if (!isAdmin) {
      query.status = 'published';
    }
    
    const course = await CourseModel.findOne(query)
      .populate('instructor', 'name email');
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Get lessons for the course
    const lessons = await LessonModel.find({ courseId: params.id })
      .sort({ order: 1 })
      .select('title description duration order isPreview videoUrl resources');
    
    return NextResponse.json({ 
      success: true,
      course, 
      lessons 
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('GET /api/courses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT update course (admin/instructor only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'instructor')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Instructor access required' },
        { status: 403, headers: corsHeaders }
      );
    }

    const body = await request.json();
    
    await db.connect();
    
    const course = await CourseModel.findByIdAndUpdate(
      params.id,
      {
        ...body,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      course 
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('PUT /api/courses/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update course' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE course (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403, headers: corsHeaders }
      );
    }

    await db.connect();
    
    const course = await CourseModel.findByIdAndDelete(params.id);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Also delete related lessons
    await LessonModel.deleteMany({ courseId: params.id });
    
    return NextResponse.json({ 
      success: true,
      message: 'Course deleted successfully' 
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('DELETE /api/courses/[id] error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete course' },
      { status: 500, headers: corsHeaders }
    );
  }
}