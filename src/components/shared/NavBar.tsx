'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronDown,
  LogOut,
  UserCircle
} from 'lucide-react'
import { useAuth } from '../Provider/Authcontext'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  hasDropdown?: boolean
  dropdownItems?: { name: string; href: string }[]
}

const NavBar: React.FC = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const navItems: NavItem[] = [
    {
      name: 'Lungi',
      href: '/Lungi',
      icon: (
        <img 
          src="https://i.ibb.co.com/wZ8hVFvD/dhoti.png" 
          alt="Lungi" 
          className="w-4 h-4"
        />
      ),
      color: '#3b82f6',
      hoverColor: '#1d4ed8',
    },
    {
      name: 'Panjabi',
      href: '/panjabi',
      icon: (
        <img 
          src="https://i.ibb.co.com/Fk2v3fDv/indian-man.png" 
          alt="Panjabi" 
          className="w-4 h-4"
        />
      ),
      color: '#8b5cf6',
      hoverColor: '#7c3aed',
    },
    {
      name: 'Others',
      href: '/others',
      icon: <span className="h-4 w-4">✨</span>,
      color: '#f59e0b',
      hoverColor: '#d97706',
    },
    {
      name: 'Sale',
      href: '/sale',
      icon: <span className="h-4 w-4">🏷️</span>,
      color: '#ef4444',
      hoverColor: '#dc2626',
    }
  ]

  const handleDropdownEnter = (itemName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(itemName)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      
      // Close mobile menu
      if (!target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
        setIsMenuOpen(false)
      }
      
      // Close user menu
      if (userMenuRef.current && !userMenuRef.current.contains(target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-3xl font-bold transition-colors duration-300 text-blue-800 hover:text-blue-600"
            >
              LungiLok
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() => item.hasDropdown && handleDropdownEnter(item.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium transition-all duration-300 flex items-center rounded-md hover:bg-opacity-10"
                    style={{ color: item.color }}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-xl py-2 z-50 border border-gray-200">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Search Bar Overlay */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                    />
                    <button
                      onClick={toggleSearch}
                      className="absolute right-2 top-2 p-1 hover:bg-purple-100 rounded"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Icon with Click Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="p-2 rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
              >
                <User className="h-5 w-5" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircle className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-3" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-3" />
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircle className="h-4 w-4 mr-3" />
                        Register
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserCircle className="h-4 w-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-3" />
                        Dashboard
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="p-2 rounded-full text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-300 relative"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all duration-300 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile User Icon */}
            <button
              onClick={toggleUserMenu}
              className="p-2 text-purple-600"
            >
              <User className="h-5 w-5" />
            </button>

            {/* Mobile Icons */}
            <Link href="/favorites" className="p-2 text-pink-600">
              <Heart className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="p-2 text-green-600 relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Link>
            
            <button
              onClick={toggleMenu}
              className="menu-toggle p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile User Dropdown Menu */}
        {showUserMenu && (
          <div className="md:hidden absolute right-4 top-16 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
            {user ? (
              <>
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <UserCircle className="h-4 w-4 mr-3" />
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <ShoppingCart className="h-4 w-4 mr-3" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="h-4 w-4 mr-3" />
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <UserCircle className="h-4 w-4 mr-3" />
                  Register
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu md:hidden absolute left-0 right-0 bg-white shadow-xl border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-purple-400" />
              </div>

              {/* Mobile Nav Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md"
                  style={{ color: item.color }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar