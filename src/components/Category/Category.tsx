'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  UserCheck, 
  Shirt, 
  Baby, 
  Sparkles, 
  Tag, 
  ArrowRight, 
  TrendingUp,
  Heart,
  Star,
  Eye,
  ShoppingBag,
  Filter,
  Grid3X3,
  List,
  Search
} from 'lucide-react'

interface CategoryItem {
  id: number
  name: string
  href: string
  image: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  description: string
  itemCount: number
  isNew?: boolean
  isTrending?: boolean
  discount?: string
}

interface SubCategory {
  name: string
  href: string
  count: number
}

const Category: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories: CategoryItem[] = [
    {
      id: 1,
      name: "Men's Fashion",
      href: '/man',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      icon: <UserCheck className="w-8 h-8" />,
      color: '#3b82f6',
      hoverColor: '#1d4ed8',
      description: 'Discover premium men\'s clothing with contemporary designs and exceptional quality.',
      itemCount: 1250,
      isTrending: true
    },
    {
      id: 2,
      name: "Women's Fashion",
      href: '/woman',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
      icon: <Shirt className="w-8 h-8" />,
      color: '#8b5cf6',
      hoverColor: '#7c3aed',
      description: 'Embrace sophistication with our curated women\'s fashion line.',
      itemCount: 2100,
      isNew: true
    },
    {
      id: 3,
      name: "Kids & Baby",
      href: '/kids',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
      icon: <Baby className="w-8 h-8" />,
      color: '#06b6d4',
      hoverColor: '#0891b2',
      description: 'Adorable and comfortable clothing for your little ones.',
      itemCount: 850,
      discount: '30% OFF'
    },
    {
      id: 4,
      name: "Accessories & Others",
      href: '/others',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=300&fit=crop',
      icon: <Sparkles className="w-8 h-8" />,
      color: '#f59e0b',
      hoverColor: '#d97706',
      description: 'Complete your look with our premium accessories collection.',
      itemCount: 650,
      isTrending: true
    },
    {
      id: 5,
      name: "Sale & Offers",
      href: '/sale',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=300&fit=crop',
      icon: <Tag className="w-8 h-8" />,
      color: '#ef4444',
      hoverColor: '#dc2626',
      description: 'Amazing deals and discounts on selected items.',
      itemCount: 420,
      discount: 'UP TO 70%',
      isNew: true
    },
    {
      id: 6,
      name: "New Arrivals",
      href: '/new-arrivals',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
      icon: <TrendingUp className="w-8 h-8" />,
      color: '#10b981',
      hoverColor: '#059669',
      description: 'Latest fashion trends and newest collections.',
      itemCount: 320,
      isNew: true,
      isTrending: true
    }
  ]

  const subCategories: { [key: string]: SubCategory[] } = {
    "Men's Fashion": [
      { name: 'Shirts', href: '/man/shirts', count: 320 },
      { name: 'T-Shirts', href: '/man/tshirts', count: 280 },
      { name: 'Pants', href: '/man/pants', count: 250 },
      { name: 'Jeans', href: '/man/jeans', count: 180 },
      { name: 'Jackets', href: '/man/jackets', count: 120 },
      { name: 'Shoes', href: '/man/shoes', count: 100 }
    ],
    "Women's Fashion": [
      { name: 'Dresses', href: '/woman/dresses', count: 450 },
      { name: 'Tops & Blouses', href: '/woman/tops', count: 380 },
      { name: 'Bottoms', href: '/woman/bottoms', count: 320 },
      { name: 'Activewear', href: '/woman/activewear', count: 280 },
      { name: 'Shoes', href: '/woman/shoes', count: 250 },
      { name: 'Handbags', href: '/woman/handbags', count: 180 }
    ],
    "Kids & Baby": [
      { name: 'Boys (2-12)', href: '/kids/boys', count: 280 },
      { name: 'Girls (2-12)', href: '/kids/girls', count: 290 },
      { name: 'Baby (0-2)', href: '/kids/babies', count: 180 },
      { name: 'School Uniforms', href: '/kids/uniforms', count: 100 }
    ]
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by <span style={{ color: '#3b82f6' }}>Category</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections designed for every style and occasion
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md text-gray-600">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium">View:</span>
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all duration-300 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Grid/List */}
        <div className={`grid gap-6 mb-12 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 ${
                viewMode === 'list' ? 'flex items-center' : ''
              }`}
              onMouseEnter={() => setSelectedCategory(category.name)}
              onMouseLeave={() => setSelectedCategory(null)}
            >
              {/* Image Section */}
              <div className={`relative overflow-hidden ${
                viewMode === 'list' ? 'w-48 h-32' : 'h-48'
              }`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div 
                  className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                  style={{ backgroundColor: category.color }}
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {category.isNew && (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                      NEW
                    </span>
                  )}
                  {category.isTrending && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      TRENDING
                    </span>
                  )}
                  {category.discount && (
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      {category.discount}
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div 
                  className="absolute top-3 right-3 p-2 rounded-full transition-all duration-300 group-hover:scale-110"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: category.color 
                  }}
                >
                  {category.icon}
                </div>
              </div>

              {/* Content Section */}
              <div className={`p-6 flex-1 ${viewMode === 'list' ? 'flex justify-between items-center' : ''}`}>
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <h3 
                    className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300"
                    style={{ color: category.color }}
                  >
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed h-14">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {category.itemCount.toLocaleString()} items
                    </span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Popular</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={category.href}
                  className={`inline-flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-300 transform group-hover:scale-105 ${
                    viewMode === 'list' ? 'ml-6' : 'w-full justify-center'
                  }`}
                  style={{
                    backgroundColor: category.color,
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = category.hoverColor
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 10px 25px ${category.color}40`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = category.color
                    e.currentTarget.style.transform = 'scale(1) translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Subcategories Preview */}
              {selectedCategory === category.name && subCategories[category.name] && viewMode === 'grid' && (
                <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="font-semibold text-gray-800 mb-2">Quick Links:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {subCategories[category.name].slice(0, 4).map((sub, index) => (
                      <Link
                        key={index}
                        href={sub.href}
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center justify-between"
                      >
                        <span>{sub.name}</span>
                        <span className="text-xs text-gray-400">({sub.count})</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Shop with <span style={{ color: '#3b82f6' }}>MIAH</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">50K+ Happy Customers</h3>
              <p className="text-gray-600 text-sm">Trusted by thousands</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">4.9/5 Rating</h3>
              <p className="text-gray-600 text-sm">Excellent reviews</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">5000+ Products</h3>
              <p className="text-gray-600 text-sm">Vast selection</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Latest Trends</h3>
              <p className="text-gray-600 text-sm">Always updated</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category