'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode?: string
  country: string
}

interface Order {
  _id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
  deliveredAt?: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders/${orderId}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setOrder(data.order)
      } else {
        throw new Error(data.message || 'Failed to fetch order')
      }
    } catch (error: any) {
      console.error('Error fetching order:', error)
      toast.error(error.message || 'Failed to fetch order details')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Shipped':
        return 'bg-blue-100 text-blue-800'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-6 h-6" />
      case 'Shipped':
        return <Truck className="w-6 h-6" />
      case 'Processing':
        return <Package className="w-6 h-6" />
      default:
        return <Clock className="w-6 h-6" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order not found</p>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${getStatusColor(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              {order.orderStatus}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">৳{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                    <p className="text-gray-600">
                      {order.shippingAddress.city}
                      {order.shippingAddress.postalCode && ` - ${order.shippingAddress.postalCode}`}
                    </p>
                    <p className="text-gray-600">{order.shippingAddress.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-900">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes</h2>
                <p className="text-gray-600">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{order.shippingCost === 0 ? 'Free' : `৳${order.shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>৳{order.tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>৳{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      order.paymentMethod === 'COD' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Payment Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                    order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Order Date</p>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>

                {order.deliveredAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Delivered Date</p>
                    <p className="text-sm text-gray-600">{formatDate(order.deliveredAt)}</p>
                  </div>
                )}
              </div>

              {order.paymentMethod === 'COD' && order.orderStatus !== 'Delivered' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Cash on Delivery:</strong> Please keep ৳{order.total.toLocaleString()} ready when the delivery arrives.
                  </p>
                </div>
              )}
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${order.orderStatus !== 'Cancelled' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">Order Placed</p>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                {['Processing', 'Shipped', 'Delivered'].includes(order.orderStatus) && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Processing</p>
                      <p className="text-sm text-gray-600">Your order is being prepared</p>
                    </div>
                  </div>
                )}

                {['Shipped', 'Delivered'].includes(order.orderStatus) && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Shipped</p>
                      <p className="text-sm text-gray-600">Your order is on the way</p>
                    </div>
                  </div>
                )}

                {order.orderStatus === 'Delivered' && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Delivered</p>
                      <p className="text-sm text-gray-600">
                        {order.deliveredAt ? formatDate(order.deliveredAt) : 'Delivered'}
                      </p>
                    </div>
                  </div>
                )}

                {order.orderStatus === 'Cancelled' && (
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2"></div>
                    <div>
                      <p className="font-medium text-red-900">Order Cancelled</p>
                      <p className="text-sm text-red-600">This order has been cancelled</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
