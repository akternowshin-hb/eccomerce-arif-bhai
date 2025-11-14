// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    await connectDB()

    const { name, phone, email, password } = await request.json()

    // Validate required fields
    if (!name || !phone || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await User.create({
      name,
      phone,
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: false
    })

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      isAdmin: user.isAdmin
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: userResponse
    })
  } catch (error: any) {
    console.error('Registration error:', error)

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Registration failed',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
