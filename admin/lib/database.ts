import { Collection, Db, Document, Filter, MongoClient, ObjectId, UpdateFilter, WithId } from "mongodb"
import clientPromise from "./db"

export interface BaseDocument {
  _id?: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

export class DatabaseService<T extends BaseDocument> {
  private collection: string
  private client: Promise<MongoClient>

  constructor(collection: string) {
    this.collection = collection
    this.client = clientPromise
  }

  private async getCollection(): Promise<Collection<T>> {
    const client = await this.client
    const db: Db = client.db(process.env.MONGODB_DB || "techmigo")
    return db.collection<T>(this.collection)
  }

  async findOne(query: Filter<T>): Promise<T | null> {
    const collection = await this.getCollection()
    const result = await collection.findOne(query)
    return result as T | null
  }

  async find(query: Filter<T>, options?: {
    limit?: number
    skip?: number
    sort?: Record<string, 1 | -1>
  }): Promise<T[]> {
    const collection = await this.getCollection()
    const cursor = collection.find(query)
    
    if (options?.limit) cursor.limit(options.limit)
    if (options?.skip) cursor.skip(options.skip)
    if (options?.sort) cursor.sort(options.sort)
    
    const results = await cursor.toArray()
    return results.map(doc => doc as T)
  }

  async create(data: Omit<T, '_id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const collection = await this.getCollection()
    const now = new Date()
    const documentToInsert = {
      ...data,
      createdAt: now,
      updatedAt: now,
    }
    
    const result = await collection.insertOne(documentToInsert as any)
    return { ...documentToInsert, _id: result.insertedId } as T
  }

  async update(id: string | ObjectId, data: Partial<Omit<T, '_id' | 'createdAt'>>): Promise<T | null> {
    const collection = await this.getCollection()
    const _id = typeof id === 'string' ? new ObjectId(id) : id
    const updateData = {
      ...data,
      updatedAt: new Date(),
    }
    
    const result = await collection.findOneAndUpdate(
      { _id: _id } as Filter<T>,
      { $set: updateData } as UpdateFilter<T>,
      { returnDocument: 'after' }
    )
    
    return result as T | null
  }

  async delete(id: string | ObjectId): Promise<boolean> {
    const collection = await this.getCollection()
    const _id = typeof id === 'string' ? new ObjectId(id) : id
    const result = await collection.deleteOne({ _id: _id } as Filter<T>)
    return result.deletedCount > 0
  }

  async count(query: Filter<T>): Promise<number> {
    const collection = await this.getCollection()
    return collection.countDocuments(query)
  }
}