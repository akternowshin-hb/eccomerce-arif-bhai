// app/api/products/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import mongoose from 'mongoose'

// GET - Fetch single product by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const product = await Product.findById(id).lean()

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product
    })
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch product',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// PUT - Update product by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Update inStock based on stock quantity
    if (body.stock !== undefined) {
      body.inStock = body.stock > 0
    }

    // Calculate discount if both prices are provided
    if (body.originalPrice && body.price) {
      body.discount = Math.round(
        ((body.originalPrice - body.price) / body.originalPrice) * 100
      )
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validators
      }
    )

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product
    })
  } catch (error: any) {
    console.error('Error updating product:', error)
    
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
        message: error.message || 'Failed to update product',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// DELETE - Delete product by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      product
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete product',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}