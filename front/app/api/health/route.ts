import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    // Check the actual value type
    const mongoUri = process.env.MONGODB_URI
    const mongoUriType = typeof mongoUri
    const mongoUriValue = mongoUri ? String(mongoUri) : null
    
    const checks = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mongodb: {
        configured: !!mongoUri,
        valueType: mongoUriType,
        uri_preview: mongoUriValue 
          ? `${mongoUriValue.substring(0, 25)}...${mongoUriValue.substring(mongoUriValue.length - 15)}` 
          : 'NOT SET',
        connected: false,
        error: null as string | null
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
      checks.mongodb.error = error.message || error.toString() || 'Unknown error'
      checks.status = "error"
      console.error("MongoDB connection error:", error)
    }

    return NextResponse.json(checks)
  } catch (error: any) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error.message || error.toString(),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
