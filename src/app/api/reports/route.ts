import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import User from '@/models/User'

// GET - Fetch reports data
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') // 'customers', 'orders', 'delivery'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.$gte = new Date(startDate)
    }
    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      dateFilter.$lte = end
    }

    const orderFilter: any = {}
    if (Object.keys(dateFilter).length > 0) {
      orderFilter.createdAt = dateFilter
    }

    switch (reportType) {
      case 'customers': {
        // Get all users from MongoDB
        const users = await User.find({}).lean()

        // Get order statistics for each user
        const customerReports = await Promise.all(
          users.map(async (user) => {
            const userOrders = await Order.find({
              userId: user._id.toString(),
              ...orderFilter
            }).sort({ createdAt: -1 }).lean()

            const totalOrders = userOrders.length
            const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)
            const lastOrderDate = userOrders.length > 0 ? userOrders[0].createdAt : null

            return {
              userId: user._id.toString(),
              email: user.email,
              fullName: user.name || 'N/A',
              phone: user.phone || 'N/A',
              totalOrders,
              totalSpent,
              lastOrderDate,
              registeredAt: user.createdAt || null
            }
          })
        )

        return NextResponse.json({
          success: true,
          type: 'customers',
          data: customerReports.sort((a, b) => b.totalOrders - a.totalOrders),
          total: customerReports.length
        })
      }

      case 'orders': {
        const orders = await Order.find(orderFilter)
          .sort({ createdAt: -1 })
          .lean()

        const orderReports = orders.map(order => ({
          orderId: order._id,
          orderNumber: order.orderNumber,
          customerName: order.shippingAddress.fullName,
          customerPhone: order.shippingAddress.phone,
          itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          total: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          orderDate: order.createdAt,
          deliveredDate: order.deliveredAt || null
        }))

        // Summary statistics
        const summary = {
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
          pendingOrders: orders.filter(o => o.orderStatus === 'Pending').length,
          processingOrders: orders.filter(o => o.orderStatus === 'Processing').length,
          shippedOrders: orders.filter(o => o.orderStatus === 'Shipped').length,
          deliveredOrders: orders.filter(o => o.orderStatus === 'Delivered').length,
          cancelledOrders: orders.filter(o => o.orderStatus === 'Cancelled').length,
          codOrders: orders.filter(o => o.paymentMethod === 'COD').length,
          paidOrders: orders.filter(o => o.paymentStatus === 'Paid').length
        }

        return NextResponse.json({
          success: true,
          type: 'orders',
          data: orderReports,
          summary,
          total: orders.length
        })
      }

      case 'delivery': {
        const deliveryFilter = {
          ...orderFilter,
          orderStatus: { $in: ['Shipped', 'Delivered'] }
        }

        const deliveries = await Order.find(deliveryFilter)
          .sort({ createdAt: -1 })
          .lean()

        const deliveryReports = deliveries.map(order => ({
          orderId: order._id,
          orderNumber: order.orderNumber,
          customerName: order.shippingAddress.fullName,
          customerPhone: order.shippingAddress.phone,
          address: `${order.shippingAddress.address}, ${order.shippingAddress.city}`,
          city: order.shippingAddress.city,
          paymentMethod: order.paymentMethod,
          total: order.total,
          orderStatus: order.orderStatus,
          orderDate: order.createdAt,
          deliveredDate: order.deliveredAt || null,
          deliveryDays: order.deliveredAt
            ? Math.ceil((new Date(order.deliveredAt).getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24))
            : null
        }))

        // Delivery statistics
        const deliveredOrders = deliveries.filter(o => o.deliveredAt)
        const averageDays = deliveredOrders.length > 0
          ? deliveredOrders.reduce((sum, order) => {
              const days = Math.ceil((new Date(order.deliveredAt!).getTime() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24))
              return sum + days
            }, 0) / deliveredOrders.length
          : 0

        const summary = {
          totalDeliveries: deliveries.length,
          shipped: deliveries.filter(o => o.orderStatus === 'Shipped').length,
          delivered: deliveries.filter(o => o.orderStatus === 'Delivered').length,
          codDeliveries: deliveries.filter(o => o.paymentMethod === 'COD').length,
          averageDeliveryDays: averageDays
        }

        return NextResponse.json({
          success: true,
          type: 'delivery',
          data: deliveryReports,
          summary,
          total: deliveries.length
        })
      }

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid report type. Use: customers, orders, or delivery' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}
