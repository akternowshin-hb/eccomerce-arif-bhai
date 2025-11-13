import { NextRequest, NextResponse } from 'next/server'

import Product from '@/models/Product'
import { connectDB } from '@/lib/mongodb'

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const onSale = searchParams.get('onSale')

    // Build query
    let query: any = {}

    if (category && category !== 'All') {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (featured === 'true') {
      query.featured = true
    }

    if (onSale === 'true') {
      query.isOnSale = true
    }

    // Fetch products
    const products = await Product.find(query).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      count: products.length,
      products
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      },
      { status: 500 }
    )
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description || !body.price || !body.category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide all required fields: name, description, price, category'
        },
        { status: 400 }
      )
    }

    // Create product
    const product = await Product.create(body)

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        product
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating product:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: messages
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create product',
        error: error.message
      },
      { status: 500 }
    )
  }
}