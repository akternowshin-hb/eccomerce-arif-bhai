'use client'

import { useState } from 'react'
import { useAuth } from '@/components/Provider/Authcontext'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Shield, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add API call to update user profile
    alert('Profile update feature coming soon!')
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-black transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 text-sm mt-1">{user.email}</p>
                {user.isAdmin && (
                  <div className="mt-4 inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4 mr-1" />
                    Administrator
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Orders:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Wishlist Items:</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center py-3 border-b border-gray-200">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center py-3 border-b border-gray-200">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center py-3 border-b border-gray-200">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-medium text-gray-900">{user.phone}</p>
                    </div>
                  </div>

                  {user.isAdmin && (
                    <div className="flex items-center py-3">
                      <Shield className="h-5 w-5 text-purple-600 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Account Type</p>
                        <p className="font-medium text-purple-600">Administrator</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            {user.isAdmin && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/dashboard"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-center"
                  >
                    <p className="font-medium text-gray-900">Dashboard</p>
                    <p className="text-xs text-gray-600 mt-1">Manage products</p>
                  </Link>
                  <Link
                    href="/dashboard/products"
                    className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all text-center"
                  >
                    <p className="font-medium text-gray-900">Products</p>
                    <p className="text-xs text-gray-600 mt-1">View all products</p>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
