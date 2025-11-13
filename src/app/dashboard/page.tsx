'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import DashboardLayout from './DashboardLayout'
import {
  Package,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  Users,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/Provider/Authcontext'

interface Product {
  _id: string
  name: string
  price: number
  stock: number
  category: string
  images: string[]
  inStock: boolean
  featured: boolean
  createdAt: string
}

interface StatsCard {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  color: string
  bgColor: string
}

const DashboardHome: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    featuredProducts: 0,
    outOfStock: 0,
    totalCategories: 0
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchProducts()
  }, [user, router])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/products')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      
      if (data.success && data.products) {
        setProducts(data.products)
        calculateStats(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (products: Product[]) => {
    const totalProducts = products.length
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length
    const featuredProducts = products.filter(p => p.featured).length
    const outOfStock = products.filter(p => p.stock === 0).length
    const categories = new Set(products.map(p => p.category)).size

    setStats({
      totalProducts,
      totalValue,
      lowStock,
      featuredProducts,
      outOfStock,
      totalCategories: categories
    })
  }

  const statsCards: StatsCard[] = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      change: 12.5,
      icon: <Package className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Value',
      value: `৳${stats.totalValue.toLocaleString()}`,
      change: 8.2,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStock,
      change: -5.4,
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Featured Products',
      value: stats.featuredProducts,
      change: 3.1,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Out of Stock',
      value: stats.outOfStock,
      change: -2.3,
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      change: 0,
      icon: <Users className="w-6 h-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ]

  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.fullName || 'Admin'}! 👋
          </h1>
          <p className="text-blue-100">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                {stat.change !== 0 && (
                  <div
                    className={`flex items-center text-sm font-medium ${
                      stat.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change > 0 ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(stat.change)}%
                  </div>
                )}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/manage?action=create"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Add New Product
                </h3>
                <p className="text-gray-600 text-sm">
                  Create and publish a new product
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/products"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  View All Products
                </h3>
                <p className="text-gray-600 text-sm">
                  Browse your entire inventory
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/manage"
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  Manage Products
                </h3>
                <p className="text-gray-600 text-sm">
                  Edit, update, or remove items
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Products</h2>
              <Link
                href="/dashboard/products"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View all
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products yet</p>
              <Link
                href="/dashboard/manage?action=create"
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentProducts.map((product) => (
                <div
                  key={product._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/60'}
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/60'
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600">
                            ৳{product.price.toLocaleString()}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              product.inStock
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        Stock: {product.stock}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        {stats.lowStock > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-orange-900 mb-1">
                  Low Stock Alert
                </h3>
                <p className="text-orange-700 mb-3">
                  You have {stats.lowStock} product{stats.lowStock > 1 ? 's' : ''} running low on stock. 
                  Consider restocking soon to avoid out-of-stock situations.
                </p>
                <Link
                  href="/dashboard/products?filter=lowStock"
                  className="inline-flex items-center text-orange-700 hover:text-orange-800 font-medium text-sm"
                >
                  View low stock products
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default DashboardHome