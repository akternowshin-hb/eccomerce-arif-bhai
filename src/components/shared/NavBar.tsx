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
  UserCheck,
  Baby,
  Sparkles,
  Tag,
  Shirt
} from 'lucide-react'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const navItems: NavItem[] = [
    {
      name: 'Man',
      href: '/man',
      icon: <UserCheck className="h-4 w-4" />,
      color: '#3b82f6', // Blue
      hoverColor: '#1d4ed8', // Darker Blue
      hasDropdown: true,
      dropdownItems: [
        { name: 'Shirts', href: '/man/shirts' },
        { name: 'Pants', href: '/man/pants' },
        { name: 'Jackets', href: '/man/jackets' },
        { name: 'Shoes', href: '/man/shoes' },
        { name: 'Accessories', href: '/man/accessories' },
      ]
    },
    {
      name: 'Woman',
      href: '/woman',
      icon: <Shirt className="h-4 w-4" />,
      color: '#8b5cf6', // Purple
      hoverColor: '#7c3aed', // Darker Purple
      hasDropdown: true,
      dropdownItems: [
        { name: 'Dresses', href: '/woman/dresses' },
        { name: 'Tops', href: '/woman/tops' },
        { name: 'Bottoms', href: '/woman/bottoms' },
        { name: 'Shoes', href: '/woman/shoes' },
        { name: 'Accessories', href: '/woman/accessories' },
      ]
    },
    {
      name: 'Kids',
      href: '/kids',
      icon: <Baby className="h-4 w-4" />,
      color: '#06b6d4', // Cyan
      hoverColor: '#0891b2', // Darker Cyan
      hasDropdown: true,
      dropdownItems: [
        { name: 'Boys', href: '/kids/boys' },
        { name: 'Girls', href: '/kids/girls' },
        { name: 'Babies', href: '/kids/babies' },
        { name: 'Shoes', href: '/kids/shoes' },
        { name: 'Accessories', href: '/kids/accessories' },
      ]
    },
    {
      name: 'Others',
      href: '/others',
      icon: <Sparkles className="h-4 w-4" />,
      color: '#f59e0b', // Amber
      hoverColor: '#d97706', // Darker Amber
      hasDropdown: true,
      dropdownItems: [
        { name: 'Home & Living', href: '/others/home' },
        { name: 'Beauty', href: '/others/beauty' },
        { name: 'Sports', href: '/others/sports' },
        { name: 'Electronics', href: '/others/electronics' },
      ]
    },
    {
      name: 'Sale',
      href: '/sale',
      icon: <Tag className="h-4 w-4" />,
      color: '#ef4444', // Red
      hoverColor: '#dc2626', // Darker Red
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      {/* Top Bar */}
      <div className="bg-gray-50 text-gray-700 text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <p className="animate-pulse">🚚 Free shipping on orders over $100 | ✨ 30-day returns</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-3xl font-bold transition-colors duration-300"
              style={{ 
                color: '#1e40af',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)' 
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#1e40af'
              }}
            >
              MIAH
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
                    className="px-3 py-2 text-sm font-medium transition-all duration-300 flex items-center rounded-md"
                    style={{
                      color: item.color,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = item.hoverColor
                      e.currentTarget.style.backgroundColor = `${item.color}15`
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = `0 4px 12px ${item.color}30`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = item.color
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.transform = 'translateY(0px)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-xl py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200 border border-gray-200">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 transition-all duration-200 rounded-sm mx-1"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${item.color}15`
                            e.currentTarget.style.color = item.hoverColor
                            e.currentTarget.style.paddingLeft = '20px'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = '#374151'
                            e.currentTarget.style.paddingLeft = '16px'
                          }}
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
                className="p-2 rounded-full transition-all duration-300"
                style={{
                  color: '#6b7280',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3b82f6'
                  e.currentTarget.style.backgroundColor = '#3b82f615'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#6b7280'
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Search Bar Overlay */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

            {/* Sign In */}
            <Link
              href="/signin"
              className="p-2 rounded-full transition-all duration-300 group"
              style={{
                color: '#6b7280',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8b5cf6'
                e.currentTarget.style.backgroundColor = '#8b5cf615'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280'
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            </Link>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="p-2 rounded-full transition-all duration-300 group relative"
              style={{
                color: '#6b7280',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ec4899'
                e.currentTarget.style.backgroundColor = '#ec489915'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280'
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span 
                className="absolute -top-1 -right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)'
                }}
              >
                3
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-full transition-all duration-300 group relative"
              style={{
                color: '#6b7280',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#059669'
                e.currentTarget.style.backgroundColor = '#05966915'
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280'
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span 
                className="absolute -top-1 -right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)'
                }}
              >
                2
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Icons */}
            <Link 
              href="/favorites" 
              className="p-2 transition-colors duration-300"
              style={{ color: '#ec4899' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#be185d'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ec4899'
              }}
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link 
              href="/cart" 
              className="p-2 relative transition-colors duration-300"
              style={{ color: '#059669' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#047857'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#059669'
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              <span 
                className="absolute -top-1 -right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)'
                }}
              >
                2
              </span>
            </Link>
            
            <button
              onClick={toggleMenu}
              className="menu-toggle p-2 rounded-md transition-colors duration-300"
              style={{ color: '#6b7280' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#374151'
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu md:hidden absolute left-0 right-0 bg-white shadow-xl border-t border-gray-200 animate-in slide-in-from-top-5 duration-300">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-purple-400" />
              </div>

              {/* Mobile Nav Items */}
              {navItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors duration-300"
                    style={{
                      color: item.color,
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = item.hoverColor
                      e.currentTarget.style.backgroundColor = `${item.color}15`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = item.color
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                  
                  {/* Mobile Dropdown Items */}
                  {item.hasDropdown && (
                    <div className="ml-4 mt-2 space-y-2">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-3 py-1 text-sm text-gray-600 hover:text-gray-800 rounded-md transition-colors duration-300"
                          style={{
                            backgroundColor: 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${item.color}10`
                            e.currentTarget.style.color = item.hoverColor
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent'
                            e.currentTarget.style.color = '#4b5563'
                          }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Sign In */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link
                  href="/signin"
                  className="flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors duration-300"
                  style={{
                    color: '#8b5cf6',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#7c3aed'
                    e.currentTarget.style.backgroundColor = '#8b5cf615'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#8b5cf6'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-5 w-5 mr-3" />
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NavBar