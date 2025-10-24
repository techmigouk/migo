import { LiveEvent } from "../models/LiveEvent"
import { DatabaseService } from "../lib/database"
import { ObjectId } from "mongodb"

export class LiveEventService extends DatabaseService<LiveEvent> {
  constructor() {
    super("liveEvents")
  }

  async findUpcoming(limit = 10): Promise<LiveEvent[]> {
    return this.find({
      date: { $gt: new Date() },
      status: { $in: ["scheduled", "live"] }
    } as any, {
      limit,
      sort: { date: 1 }
    })
  }

  async findByInstructor(instructorId: string | ObjectId): Promise<LiveEvent[]> {
    return this.find({ instructor: new ObjectId(instructorId) } as any)
  }

  async registerParticipant(
    eventId: string | ObjectId,
    userId: string | ObjectId
  ): Promise<LiveEvent | null> {
    const event = await this.findOne({ _id: new ObjectId(eventId) } as any)
    if (!event) return null

    // Check if event is full
    if (
      event.maxParticipants &&
      event.registeredParticipants.length >= event.maxParticipants
    ) {
      // Add to waitlist instead
      return this.update(eventId, {
        $addToSet: { waitlist: new ObjectId(userId) }
      } as any)
    }

    return this.update(eventId, {
      $addToSet: { registeredParticipants: new ObjectId(userId) }
    } as any)
  }

  async unregisterParticipant(
    eventId: string | ObjectId,
    userId: string | ObjectId
  ): Promise<LiveEvent | null> {
    const event = await this.findOne({ _id: new ObjectId(eventId) } as any)
    if (!event) return null

    // Remove from registeredParticipants
    const result = await this.update(eventId, {
      $pull: { registeredParticipants: new ObjectId(userId) }
    } as any)

    // If there's someone on the waitlist, move them to registered
    if (event.waitlist?.length > 0 && result) {
      const [nextParticipant, ...remainingWaitlist] = event.waitlist
      await this.update(eventId, {
        $addToSet: { registeredParticipants: nextParticipant },
        $set: { waitlist: remainingWaitlist }
      } as any)
    }

    return result
  }

  async addFeedback(
    eventId: string | ObjectId,
    userId: string | ObjectId,
    rating: number,
    comment: string
  ): Promise<LiveEvent | null> {
    return this.update(eventId, {
      $push: {
        feedback: {
          userId: new ObjectId(userId),
          rating,
          comment,
          createdAt: new Date()
        }
      }
    } as any)
  }

  async updateStatus(
    eventId: string | ObjectId,
    status: LiveEvent['status']
  ): Promise<LiveEvent | null> {
    return this.update(eventId, { status } as any)
  }

  async addRecording(
    eventId: string | ObjectId,
    recording: LiveEvent['recording']
  ): Promise<LiveEvent | null> {
    return this.update(eventId, { recording } as any)
  }
}