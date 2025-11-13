// lib/mongodb.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lungilok'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

// Type for cached connection
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// Extend global object
declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    console.log('🔄 Using cached MongoDB connection')
    return cached.conn
  }

  // Create new connection if no existing promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
      family: 4 // Use IPv4, skip trying IPv6
    }

    console.log('🔌 Connecting to MongoDB...')
    console.log('📍 URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')) // Hide password in logs

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB Connected Successfully')
        console.log('📊 Database:', mongoose.connection.db.databaseName)
        console.log('🌐 Host:', mongoose.connection.host)
        return mongoose
      })
      .catch((error) => {
        console.error('❌ MongoDB Connection Error:', error)
        cached.promise = null // Reset promise on error
        throw error
      })
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    throw error
  }

  return cached.conn
}

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to DB')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected')
})

// Graceful shutdown
if (process.env.NODE_ENV !== 'production') {
  process.on('SIGINT', async () => {
    await mongoose.connection.close()
    console.log('👋 Mongoose connection closed through app termination')
    process.exit(0)
  })
}