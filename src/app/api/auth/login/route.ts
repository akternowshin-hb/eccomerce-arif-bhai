// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

// Static admin credentials (you can change these)
const ADMIN_EMAIL = 'admin@lungilok.com'
const ADMIN_PASSWORD = 'admin123'

export async function POST(request: Request) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Check if it's admin login
    if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        _id: 'admin',
        name: 'Admin',
        email: ADMIN_EMAIL,
        phone: 'N/A',
        isAdmin: true
      }

      return NextResponse.json({
        success: true,
        message: 'Admin login successful',
        user: adminUser
      })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

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
      message: 'Login successful',
      user: userResponse
    })
  } catch (error: any) {
    console.error('Login error:', error)

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Login failed',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
