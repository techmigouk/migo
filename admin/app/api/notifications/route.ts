import { NextResponse } from 'next/server'
import { Notification } from '@amigo/shared'
import { db } from '@/lib/db'
import mongoose from 'mongoose'

// Admin endpoint to create notifications
export async function POST(request: Request) {
  try {
    await db.connect()

    const body = await request.json()
    const { userId, userIds, type, title, message, icon, link, sendToAll } = body

    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      )
    }

    let notifications = []

    if (sendToAll) {
      // Send to all users - TODO: Implement batch notification creation
      // This should be done in batches for large user bases
      return NextResponse.json(
        { error: 'Send to all users not implemented yet' },
        { status: 501 }
      )
    } else if (userIds && Array.isArray(userIds)) {
      // Send to multiple specific users
      notifications = await Notification.insertMany(
        userIds.map((id: string) => ({
          userId: new mongoose.Types.ObjectId(id),
          type: type || 'info',
          title,
          message,
          icon,
          link,
          isRead: false,
        }))
      )
    } else if (userId) {
      // Send to single user
      const notification = await Notification.create({
        userId: new mongoose.Types.ObjectId(userId),
        type: type || 'info',
        title,
        message,
        icon,
        link,
        isRead: false,
      })
      notifications = [notification]
    } else {
      return NextResponse.json(
        { error: 'userId, userIds, or sendToAll must be provided' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      count: notifications.length,
      notifications,
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}

// Get all notifications (admin view)
export async function GET() {
  try {
    await db.connect()

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'name email')
      .lean()

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
