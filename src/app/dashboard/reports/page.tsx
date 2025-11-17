'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '../DashboardLayout'
import {
  Download,
  Users,
  ShoppingCart,
  Truck,
  Calendar,
  TrendingUp,
  FileText,
  Loader2,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

type ReportType = 'customers' | 'orders' | 'delivery'

interface CustomerReport {
  userId: string
  email: string
  fullName: string
  phone: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string | null
  registeredAt: string | null
}

interface OrderReport {
  orderId: string
  orderNumber: string
  customerName: string
  customerPhone: string
  itemCount: number
  total: number
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  orderDate: string
  deliveredDate: string | null
}

interface DeliveryReport {
  orderId: string
  orderNumber: string
  customerName: string
  customerPhone: string
  address: string
  city: string
  paymentMethod: string
  total: number
  orderStatus: string
  orderDate: string
  deliveredDate: string | null
  deliveryDays: number | null
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportType>('customers')
  const [isLoading, setIsLoading] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchReport()
  }, [activeTab, dateRange])

  const fetchReport = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        type: activeTab
      })

      if (dateRange.startDate) {
        params.append('startDate', dateRange.startDate)
      }
      if (dateRange.endDate) {
        params.append('endDate', dateRange.endDate)
      }

      const response = await fetch(`/api/reports?${params.toString()}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setReportData(data)
      } else {
        throw new Error(data.message || 'Failed to fetch report')
      }
    } catch (error: any) {
      console.error('Error fetching report:', error)
      toast.error(error.message || 'Failed to fetch report')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReport = (format: 'csv' | 'json') => {
    if (!reportData || !reportData.data) {
      toast.error('No data to download')
      return
    }

    const filename = `${activeTab}_report_${new Date().toISOString().split('T')[0]}`

    if (format === 'csv') {
      downloadCSV(reportData.data, filename)
    } else {
      downloadJSON(reportData, filename)
    }

    toast.success(`Report downloaded as ${format.toUpperCase()}`)
  }

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    // Get headers from first object
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header]
          // Escape commas and quotes in CSV
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.csv`
    link.click()
  }

  const downloadJSON = (data: any, filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}.json`
    link.click()
  }

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '৳0'
    }
    return `৳${amount.toLocaleString()}`
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-GB')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600 mt-1">View and download business reports</p>
          </div>
          <button
            onClick={() => downloadReport('csv')}
            disabled={isLoading || !reportData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>

        {/* Date Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setDateRange({ startDate: '', endDate: '' })}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'customers'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-5 h-5" />
                Customer Reports
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'orders'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Order Reports
              </button>
              <button
                onClick={() => setActiveTab('delivery')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === 'delivery'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Truck className="w-5 h-5" />
                Delivery Reports
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                {reportData?.summary && activeTab === 'orders' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalOrders}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-900">{formatCurrency(reportData.summary.totalRevenue)}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-yellow-600 font-medium">COD Orders</p>
                      <p className="text-2xl font-bold text-yellow-900">{reportData.summary.codOrders}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-600 font-medium">Delivered</p>
                      <p className="text-2xl font-bold text-purple-900">{reportData.summary.deliveredOrders}</p>
                    </div>
                  </div>
                )}

                {reportData?.summary && activeTab === 'delivery' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600 font-medium">Total Deliveries</p>
                      <p className="text-2xl font-bold text-blue-900">{reportData.summary.totalDeliveries}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600 font-medium">Delivered</p>
                      <p className="text-2xl font-bold text-green-900">{reportData.summary.delivered}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <p className="text-sm text-yellow-600 font-medium">In Transit</p>
                      <p className="text-2xl font-bold text-yellow-900">{reportData.summary.shipped}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-600 font-medium">Avg Delivery Days</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {reportData.summary.averageDeliveryDays ? reportData.summary.averageDeliveryDays.toFixed(1) : '0'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Customer Reports Table */}
                {activeTab === 'customers' && reportData?.data && (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Customer Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Email Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Phone Number</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Total Orders</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Total Spent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Last Order Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Registered Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {reportData.data.map((customer: CustomerReport) => (
                          <tr key={customer.userId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{customer.fullName}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{customer.phone}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 text-center whitespace-nowrap">{customer.totalOrders}</td>
                            <td className="px-6 py-4 text-sm font-medium text-green-600 whitespace-nowrap">{formatCurrency(customer.totalSpent)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{formatDate(customer.lastOrderDate)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{formatDate(customer.registeredAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {reportData.data.length === 0 && (
                      <p className="text-center py-8 text-gray-500">No customer data available</p>
                    )}
                  </div>
                )}

                {/* Order Reports Table */}
                {activeTab === 'orders' && reportData?.data && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.data.map((order: OrderReport) => (
                          <tr key={order.orderId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.orderNumber}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {order.customerName}<br />
                              <span className="text-xs text-gray-500">{order.customerPhone}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{order.itemCount}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(order.total)}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                order.paymentMethod === 'COD' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                                order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                order.orderStatus === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.orderDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {reportData.data.length === 0 && (
                      <p className="text-center py-8 text-gray-500">No order data available</p>
                    )}
                  </div>
                )}

                {/* Delivery Reports Table */}
                {activeTab === 'delivery' && reportData?.data && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery Days</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {reportData.data.map((delivery: DeliveryReport) => (
                          <tr key={delivery.orderId} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-blue-600">{delivery.orderNumber}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {delivery.customerName}<br />
                              <span className="text-xs text-gray-500">{delivery.customerPhone}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{delivery.city}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(delivery.total)}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                delivery.paymentMethod === 'COD' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {delivery.paymentMethod}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                delivery.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {delivery.orderStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {delivery.deliveryDays !== null ? `${delivery.deliveryDays} days` : 'In transit'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {reportData.data.length === 0 && (
                      <p className="text-center py-8 text-gray-500">No delivery data available</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
