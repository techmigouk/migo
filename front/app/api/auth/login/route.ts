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

    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not set")
      return NextResponse.json(
        { error: "Database configuration error. Please contact support." },
        { status: 500 }
      )
    }

    // Connect to database
    console.log("Connecting to database...")
    await db.connect()
    console.log("Database connected")

    // Find user (include password field)
    console.log("Finding user:", email)
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      console.log("User not found")
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    console.log("User found, verifying password")
    // Verify password using the model method
    const isValid = await user.comparePassword(password)
    if (!isValid) {
      console.log("Invalid password")
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    console.log("Password valid, generating token")
    // Generate JWT token
    const token = authUtils.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    })

    console.log("Login successful")
    // Return success response
    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        phone: user.phone,
        learningGoal: user.learningGoal,
        notificationPrefs: user.notificationPrefs
      },
      token
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { 
        error: "Login failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}