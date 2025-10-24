import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const checks = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mongodb: {
        configured: !!process.env.MONGODB_URI,
        uri_preview: process.env.MONGODB_URI 
          ? `${process.env.MONGODB_URI.substring(0, 20)}...` 
          : 'NOT SET',
        connected: false
      },
      urls: {
        front: process.env.NEXT_PUBLIC_FRONT_URL || 'NOT SET',
        user: process.env.NEXT_PUBLIC_USER_DASHBOARD_URL || 'NOT SET',
        api: process.env.NEXT_PUBLIC_API_URL || 'NOT SET'
      }
    }

    // Try to connect to database
    try {
      await db.connect()
      checks.mongodb.connected = true
    } catch (error: any) {
      checks.mongodb.connected = false
      checks.status = "error"
    }

    return NextResponse.json(checks)
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
