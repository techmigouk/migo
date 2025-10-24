import { NextResponse } from "next/server"
import crypto from "crypto"

import { db } from "@/lib/db"
import { UserModel, emailService, authUtils } from "@amigo/shared"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // Input validation
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Connect to database
    await db.connect()

    // Find user
    const user = await UserModel.findOne({ email })
    if (!user) {
      // For security, don't reveal whether user exists
      return NextResponse.json({
        success: true,
        message: "If your email exists in our system, you will receive a reset link shortly",
      })
    }

    // Generate reset token
    const resetToken = authUtils.generateResetToken()

    // Send reset email
    await emailService.sendPasswordResetEmail(email, user.name, resetToken)

    // Return success response
    return NextResponse.json({
      success: true,
      message: "If your email exists in our system, you will receive a reset link shortly",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}