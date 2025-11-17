'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  User,
  FileText
} from 'lucide-react'
import { useAuth } from '@/components/Provider/Authcontext'


interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'All Products',
      href: '/dashboard/products',
      icon: <Package className="w-5 h-5" />
    },
    {
      name: 'Manage Products',
      href: '/dashboard/manage',
      icon: <ShoppingCart className="w-5 h-5" />
    },
    {
      name: 'Reports',
      href: '/dashboard/reports',
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: 'Profile',
      href: '/dashboard/profile',
      icon: <User className="w-5 h-5" />
    }
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-700">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Desktop sidebar toggle */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:block p-2 rounded-md text-gray-600 hover:bg-gray-100 mr-4"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Logo/Brand */}
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">LungiLok</span>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                  Admin
                </span>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {user?.fullName?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar - Desktop */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-20 hidden lg:block ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <nav className="h-full flex flex-col p-4">
          {/* Navigation Items */}
          <div className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && (
                    <>
                      <span className="ml-3 font-medium">{item.name}</span>
                      {isActive && (
                        <ChevronRight className="ml-auto w-4 h-4" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 pt-4 space-y-1">
            <Link
              href="/dashboard/settings"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-500" />
              {isSidebarOpen && <span className="ml-3 font-medium">Settings</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          ></div>

          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-full w-64 bg-white z-50 lg:hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link href="/dashboard" className="flex items-center" onClick={toggleMobileMenu}>
                <span className="text-xl font-bold text-blue-600">LungiLok</span>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                  Admin
                </span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col h-[calc(100%-5rem)] p-4">
              <div className="flex-1 space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={toggleMobileMenu}
                      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                        {item.icon}
                      </span>
                      <span className="ml-3 font-medium">{item.name}</span>
                      {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
                    </Link>
                  )
                })}
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-gray-200 pt-4 space-y-1">
                <Link
                  href="/dashboard/settings"
                  onClick={toggleMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="ml-3 font-medium">Settings</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3 font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </aside>
        </>
      )}

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout