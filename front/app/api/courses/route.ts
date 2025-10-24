import { NextRequest, NextResponse } from 'next/server';
import { CourseModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET all courses (public) or filtered by status (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    
    await db.connect();
    
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      // Default to published for public access (only if no status param at all)
      query.status = 'published';
    }
    // If status === 'all', don't filter by status
    
    if (category) query.category = category;
    if (level) query.level = level;
    
    const courses = await CourseModel.find(query)
      .populate('instructor', 'name email')
      .select('-__v')
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ 
      success: true,
      courses 
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('GET /api/courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST create new course (admin/instructor only)
export async function POST(request: NextRequest) {
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
    
    const course = await CourseModel.create({
      ...body,
      instructor: payload.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true,
      course 
    }, { 
      status: 201, 
      headers: corsHeaders 
    });
  } catch (error: any) {
    console.error('POST /api/courses error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create course' },
      { status: 500, headers: corsHeaders }
    );
  }
}