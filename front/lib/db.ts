import mongoose, { Connection } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export const db = {
  connect: async () => {
    if (cached.conn) {
      return cached.conn
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      }

      cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => {
        return mongooseInstance.connection
      })
    }

    try {
      cached.conn = await cached.promise
    } catch (e) {
      cached.promise = null
      throw e
    }

    return cached.conn
  },
  disconnect: async () => {
    await mongoose.disconnect()
    cached.conn = null
    cached.promise = null
  }
}

// Augment global type to include mongoose cache
declare global {
  var mongoose: {
    conn: Connection | null
    promise: Promise<Connection> | null
  }
}