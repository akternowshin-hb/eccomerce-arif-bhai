import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order, { IOrder } from '@/models/Order'
import Product from '@/models/Product'
import User from '@/models/User'

// GET - Fetch all orders (with optional filters)
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const filter: any = {}
    if (userId) filter.userId = userId
    if (status) filter.orderStatus = status
    if (paymentStatus) filter.paymentStatus = paymentStatus

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()

    const total = await Order.countDocuments(filter)

    return NextResponse.json({
      success: true,
      orders,
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const {
      userId,
      items,
      shippingAddress,
      paymentMethod = 'COD',
      shippingCost = 0,
      tax = 0,
      notes
    } = body

    // Validation
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Order must have at least one item' },
        { status: 400 }
      )
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
      return NextResponse.json(
        { success: false, message: 'Complete shipping address is required' },
        { status: 400 }
      )
    }

    // Verify products exist and have sufficient stock
    const productIds = items.map((item: any) => item.productId)
    const products = await Product.find({ _id: { $in: productIds } })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, message: 'Some products not found' },
        { status: 404 }
      )
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.productId)
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product ${item.name} not found` },
          { status: 404 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}` },
          { status: 400 }
        )
      }
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const total = subtotal + shippingCost + tax

    // Generate order number
    const count = await Order.countDocuments()
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const orderNumber = `LL${year}${month}${(count + 1).toString().padStart(5, '0')}`

    // Create order
    const order = await Order.create({
      userId,
      orderNumber,
      items,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      orderStatus: 'Pending',
      subtotal,
      shippingCost,
      tax,
      total,
      notes
    })

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      )
    }

    // Update user's phone in MongoDB if not already set
    try {
      const mongoUser = await User.findById(userId)
      if (mongoUser && (!mongoUser.phone || mongoUser.phone === 'N/A')) {
        await User.findByIdAndUpdate(userId, {
          phone: shippingAddress.phone,
          name: shippingAddress.fullName
        })
      }
    } catch (dbError) {
      console.error('Error updating MongoDB user:', dbError)
      // Don't fail the order if user update fails
    }

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      order
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
