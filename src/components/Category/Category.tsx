'use client'

import React, { useState, useEffect } from 'react'
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
  const [productCounts, setProductCounts] = useState<{[key: string]: number}>({})

  // Fetch product counts for each category
  useEffect(() => {
    const fetchProductCounts = async () => {
      try {
        const categories = ['lungi', 'panjabi', 'others']
        const counts: {[key: string]: number} = {}

        for (const category of categories) {
          const response = await fetch(`/api/products?category=${category}`)
          const data = await response.json()
          counts[category] = data.products?.length || 0
        }

        // Fetch sale products count - only count products with discount
        const allResponse = await fetch(`/api/products`)
        const allData = await allResponse.json()
        const saleCount = allData.products?.filter((p: any) =>
          p.originalPrice && p.originalPrice > p.price
        ).length || 0
        counts['sale'] = saleCount

        setProductCounts(counts)
      } catch (error) {
        console.error('Error fetching product counts:', error)
      }
    }

    fetchProductCounts()
  }, [])

  const categories: CategoryItem[] = [
    {
      id: 1,
      name: "Lungi Collection",
      href: '/lungi',
      image: 'https://i.ibb.co.com/FLQx7R9R/lungi.jpg',
      icon: (
        <img
          src="https://i.ibb.co.com/wZ8hVFvD/dhoti.png"
          alt="Lungi"
          className="w-8 h-8"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ),
      color: '#3b82f6',
      hoverColor: '#1d4ed8',
      description: 'Traditional and modern lungis for comfort and style in everyday wear.',
      itemCount: productCounts['lungi'] || 0,
      isTrending: true
    },
    {
      id: 2,
      name: "Panjabi Collection",
      href: '/panjabi',
      image: 'https://i.ibb.co.com/ksN4ZNMM/medium-shot-man-looking-ukranian.jpg',
      icon: (
        <img
          src="https://i.ibb.co.com/Fk2v3fDv/indian-man.png"
          alt="Panjabi"
          className="w-8 h-8"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ),
      color: '#8b5cf6',
      hoverColor: '#7c3aed',
      description: 'Elegant panjabis perfect for religious occasions and cultural celebrations.',
      itemCount: productCounts['panjabi'] || 0,
      isNew: true
    },
    // {
    //   id: 3,
    //   name: "Others",
    //   href: '/others',
    //   image: 'https://i.ibb.co.com/0p73F9N4/young-indian-woman-wearing-sari-1.jpg',
    //   icon: <Sparkles className="w-8 h-8" />,
    //   color: '#f59e0b',
    //   hoverColor: '#d97706',
    //   description: 'Complete your look with our premium accessories collection.',
    //   itemCount: productCounts['others'] || 0,
    //   isTrending: true
    // },
    {
      id: 3,
      name: "Sale & Offers",
      href: '/sale',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&h=300&fit=crop',
      icon: <Tag className="w-8 h-8" />,
      color: '#ef4444',
      hoverColor: '#dc2626',
      description: 'Amazing deals and discounts on selected items.',
      itemCount: productCounts['sale'] || 0,
      discount: 'UP TO 70%',
      isNew: true
    }
  ]

  const subCategories: { [key: string]: SubCategory[] } = {
    "Lungi Collection": [
      { name: 'Cotton Lungi', href: '/lungi/cotton', count: 280 },
      { name: 'Silk Lungi', href: '/lungi/silk', count: 180 },
      { name: 'Designer Lungi', href: '/lungi/designer', count: 150 },
      { name: 'Casual Lungi', href: '/lungi/casual', count: 120 },
      { name: 'Printed Lungi', href: '/lungi/printed', count: 90 },
      { name: 'Checkered Lungi', href: '/lungi/checkered', count: 75 }
    ],
    "Panjabi Collection": [
      { name: 'Full Sleeve Panjabi', href: '/panjabi/full-sleeve', count: 320 },
      { name: 'Half Sleeve Panjabi', href: '/panjabi/half-sleeve', count: 250 },
      { name: 'Embroidered Panjabi', href: '/panjabi/embroidered', count: 180 },
      { name: 'Cotton Panjabi', href: '/panjabi/cotton', count: 150 },
      { name: 'Silk Panjabi', href: '/panjabi/silk', count: 120 },
      { name: 'Formal Panjabi', href: '/panjabi/formal', count: 100 }
    ],
    "Traditional Wear": [
      { name: 'Kurta', href: '/traditional/kurta', count: 200 },
      { name: 'Dhoti', href: '/traditional/dhoti', count: 150 },
      { name: 'Fatua', href: '/traditional/fatua', count: 120 },
      { name: 'Pajama', href: '/traditional/pajama', count: 100 },
      { name: 'Traditional Caps', href: '/traditional/caps', count: 80 },
      { name: 'Prayer Outfit', href: '/traditional/prayer', count: 70 }
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
        {/* <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          
          <div className="relative flex-1 max-w-md text-gray-700">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          =
        </div> */}

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
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-125"
                  style={{
                    transformOrigin: 'center center'
                  }}
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
                  
                  <p className="text-gray-600 mb-4 leading-relaxed h-12">
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
                  href={`/products?category=${category.href.substring(1)}`}
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

              
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Shop with <span style={{ color: '#3b82f6' }}>LungiLok</span>?
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