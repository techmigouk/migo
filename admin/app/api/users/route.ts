import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@amigo/shared';

export async function GET() {
  try {
    const users = await UserModel.find({}).select('-password');
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = new UserModel(body);
    await user.save();
    
    const { password, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}