import { NextRequest, NextResponse } from 'next/server';
import { CategoryModel } from '@amigo/shared';
import { db } from '@/lib/db';

// GET all categories
export async function GET() {
  try {
    await db.connect();
    
    // In admin API, return ALL categories (both active and inactive)
    const categories = await CategoryModel.find({})
      .sort({ order: 1, name: 1 })
      .lean();
    
    console.log('Fetched categories:', categories.length);
    
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  console.log('=== POST /api/categories CALLED ===');
  
  try {
    console.log('Connecting to database...');
    await db.connect();
    console.log('Database connected');
    
    console.log('Parsing request body...');
    const body = await request.json();
    console.log('Request body received:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.name || body.name.trim() === '') {
      console.log('Validation failed: name is required');
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    console.log('Checking for existing category with name:', body.name);
    // Check if category with same name already exists
    const existingCategory = await CategoryModel.findOne({ 
      name: { $regex: new RegExp(`^${body.name}$`, 'i') } 
    });
    
    if (existingCategory) {
      console.log('Category already exists:', existingCategory._id);
      return NextResponse.json(
        { success: false, error: 'A category with this name already exists' },
        { status: 409 }
      );
    }
    
    console.log('Creating new category document...');
    // Generate slug manually (since pre-save hook may not run)
    const slug = body.name.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const category = new CategoryModel({
      name: body.name.trim(),
      slug,
      description: body.description?.trim() || '',
      icon: body.icon || '',
      order: body.order || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
    });

    console.log('Saving category to database...');
    await category.save();

    console.log('✅ Category created successfully!');
    console.log('- ID:', category._id);
    console.log('- Name:', category.name);
    console.log('- Slug:', category.slug);

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    console.error('❌ ERROR creating category:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}
