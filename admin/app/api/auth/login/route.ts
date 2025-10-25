import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { UserModel, authUtils } from "@amigo/shared"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input with Zod
    const validationResult = loginSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = validationResult.data

    // Connect to database
    await db.connect()

    // Find user (include password field)
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Check if user is admin or instructor
    if (user.role !== 'admin' && user.role !== 'instructor') {
      return NextResponse.json(
        { error: "Access denied - Admin or instructor privileges required" },
        { status: 403 }
      )
    }

    // Verify password using the model method
    const isValid = await user.comparePassword(password)
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = authUtils.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    })

    // Return success response
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar
      },
      token
    })
  } catch (error: any) {
    console.error("Admin login error:", error)
    
    // Specific error messages for common issues
    if (error.message?.includes('MONGODB_URI') || error.message?.includes('database')) {
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    )
  }
}