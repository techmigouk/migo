import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { UserModel, authUtils, emailService } from "@amigo/shared"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input with Zod
    const validationResult = registerSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, email, password } = validationResult.data

    // Connect to database
    await db.connect()

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      )
    }

    // Create user (password will be hashed by the pre-save hook)
    const user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "user"
    })

    // Generate JWT token
    const token = authUtils.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    })

    // Send welcome email (don't await to avoid blocking the response)
    emailService.sendWelcomeEmail(user.email, user.name).catch((error: Error) => {
      console.error("Failed to send welcome email:", error)
    })

    // Return success response
    return NextResponse.json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      token
    }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration failed" },
      { status: 500 }
    )
  }
}