'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Heart, 
  Star, 
  ShoppingCart, 
  Eye, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  ArrowUpDown,
  X,
  MapPin,
  Truck,
  Shield,
  ArrowLeft,
  Share2
} from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviews: number
  image: string
  images: string[]
  category: string
  subcategory?: string
  brand?: string
  inStock: boolean
  freeShipping: boolean
  isNew?: boolean
  isBestseller?: boolean
  colors?: string[]
  sizes?: string[]
  description: string
  location: string
}

interface FilterState {
  priceRange: [number, number]
  rating: number
  brands: string[]
  colors: string[]
  sizes: string[]
  freeShipping: boolean
  inStock: boolean
}

const ProductListing: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get URL parameters using Next.js built-in hooks
  const category = searchParams.get('category') || 'all'
  const subcategory = searchParams.get('subcategory') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popularity')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<number[]>([])

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    rating: 0,
    brands: [],
    colors: [],
    sizes: [],
    freeShipping: false,
    inStock: false
  })

  // Sample products data with working images
  const getAllProducts = (): Product[] => {
    const baseProducts: Product[] = [
      // Lungi products
      {
        id: 1,
        name: "Premium Cotton Lungi - Traditional Bengali Style",
        price: 1200,
        originalPrice: 1500,
        discount: 20,
        rating: 4.5,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop"],
        category: "lungi",
        subcategory: "cotton",
        brand: "LungiLok",
        inStock: true,
        freeShipping: true,
        isNew: true,
        colors: ["Blue", "Green", "Red"],
        sizes: ["M", "L", "XL"],
        description: "Traditional handwoven cotton lungi with authentic Bengali patterns",
        location: "Dhaka"
      },
      {
        id: 2,
        name: "Silk Premium Lungi with Gold Border",
        price: 2800,
        originalPrice: 3200,
        discount: 12,
        rating: 4.8,
        reviews: 189,
        image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=500&fit=crop"],
        category: "lungi",
        subcategory: "silk",
        brand: "Royal Textiles",
        inStock: true,
        freeShipping: true,
        isBestseller: true,
        colors: ["Golden", "Silver", "Maroon"],
        sizes: ["L", "XL", "XXL"],
        description: "Luxurious silk lungi perfect for special occasions",
        location: "Rajshahi"
      },
      {
        id: 3,
        name: "Casual Designer Lungi - Modern Fit",
        price: 950,
        rating: 4.2,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop"],
        category: "lungi",
        subcategory: "designer",
        brand: "ModernWear",
        inStock: true,
        freeShipping: false,
        colors: ["Navy", "Black", "Grey"],
        sizes: ["M", "L", "XL"],
        description: "Contemporary design meets traditional comfort",
        location: "Chittagong"
      },
      // Panjabi products
      {
        id: 4,
        name: "Eid Special Embroidered Panjabi",
        price: 2200,
        originalPrice: 2800,
        discount: 21,
        rating: 4.7,
        reviews: 312,
        image: "https://images.unsplash.com/photo-1622445275230-0f40c2d18156?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1622445275230-0f40c2d18156?w=500&h=500&fit=crop"],
        category: "panjabi",
        subcategory: "embroidered",
        brand: "Festival Wear",
        inStock: true,
        freeShipping: true,
        isNew: true,
        colors: ["White", "Cream", "Light Blue"],
        sizes: ["M", "L", "XL", "XXL"],
        description: "Elegant embroidered panjabi for religious festivals",
        location: "Sylhet"
      },
      {
        id: 5,
        name: "Full Sleeve Cotton Panjabi",
        price: 1800,
        rating: 4.4,
        reviews: 267,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=500&fit=crop"],
        category: "panjabi",
        subcategory: "full-sleeve",
        brand: "Comfort Plus",
        inStock: true,
        freeShipping: true,
        isBestseller: true,
        colors: ["White", "Sky Blue", "Light Green"],
        sizes: ["S", "M", "L", "XL"],
        description: "Comfortable full sleeve panjabi for daily wear",
        location: "Khulna"
      },
      // Traditional wear
      {
        id: 6,
        name: "Traditional Kurta Set",
        price: 1650,
        originalPrice: 2000,
        discount: 17,
        rating: 4.3,
        reviews: 198,
        image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=500&h=500&fit=crop"],
        category: "traditional",
        subcategory: "kurta",
        brand: "Heritage",
        inStock: true,
        freeShipping: false,
        colors: ["Maroon", "Navy", "Olive"],
        sizes: ["M", "L", "XL"],
        description: "Classic traditional kurta with matching accessories",
        location: "Barisal"
      },
      // Others/Accessories
      {
        id: 7,
        name: "Premium Prayer Cap",
        price: 450,
        originalPrice: 600,
        discount: 25,
        rating: 4.6,
        reviews: 145,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop"],
        category: "others",
        subcategory: "caps",
        brand: "Islamic Wear",
        inStock: true,
        freeShipping: true,
        colors: ["White", "Black", "Brown"],
        sizes: ["Free Size"],
        description: "High quality prayer cap made from premium materials",
        location: "Comilla"
      },
      // Additional products for testing
      {
        id: 8,
        name: "Cotton Checkered Lungi",
        price: 800,
        rating: 4.1,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop"],
        category: "lungi",
        subcategory: "checkered",
        brand: "LungiLok",
        inStock: true,
        freeShipping: true,
        colors: ["Blue-White", "Red-White"],
        sizes: ["M", "L", "XL"],
        description: "Classic checkered pattern lungi for everyday wear",
        location: "Dhaka"
      },
      // More products for better testing
      {
        id: 9,
        name: "Elegant Wedding Kurta",
        price: 3500,
        originalPrice: 4200,
        discount: 17,
        rating: 4.9,
        reviews: 87,
        image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=500&fit=crop"],
        category: "traditional",
        subcategory: "kurta",
        brand: "Royal Collection",
        inStock: true,
        freeShipping: true,
        isNew: true,
        isBestseller: true,
        colors: ["Gold", "Cream", "White"],
        sizes: ["M", "L", "XL", "XXL"],
        description: "Luxurious wedding kurta with intricate embroidery",
        location: "Dhaka"
      },
      {
        id: 10,
        name: "Premium Leather Belt",
        price: 850,
        originalPrice: 1200,
        discount: 29,
        rating: 4.3,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"],
        category: "others",
        subcategory: "accessories",
        brand: "Style Plus",
        inStock: true,
        freeShipping: false,
        colors: ["Black", "Brown", "Tan"],
        sizes: ["32", "34", "36", "38", "40"],
        description: "Genuine leather belt perfect for formal and casual wear",
        location: "Chittagong"
      }
    ]

    return baseProducts
  }

  useEffect(() => {
    setLoading(true)
    const allProducts = getAllProducts()
    
    let categoryProducts = allProducts
    if (category && category !== 'all') {
      categoryProducts = allProducts.filter(product => product.category === category)
    }
    if (subcategory) {
      categoryProducts = categoryProducts.filter(product => product.subcategory === subcategory)
    }

    setProducts(categoryProducts)
    setFilteredProducts(categoryProducts)
    setLoading(false)
  }, [category, subcategory])

  useEffect(() => {
    let filtered = [...products]

    // Apply filters
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating)
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand || ''))
    }

    if (filters.freeShipping) {
      filtered = filtered.filter(product => product.freeShipping)
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock)
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default: // popularity
        filtered.sort((a, b) => b.reviews - a.reviews)
    }

    setFilteredProducts(filtered)
  }, [products, filters, sortBy])

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const getCategoryTitle = () => {
    const titles: { [key: string]: string } = {
      lungi: 'Lungi Collection',
      panjabi: 'Panjabi Collection', 
      traditional: 'Traditional Wear',
      others: 'Accessories & Others',
      all: 'All Products'
    }
    return titles[category] || 'Products'
  }

  const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getCategoryTitle()}</h1>
                <p className="text-gray-600">{filteredProducts.length} products found</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`bg-white rounded-lg shadow-sm p-6 transition-all duration-300 ${
            showFilters ? 'w-80' : 'w-0 overflow-hidden p-0'
          } lg:w-80 lg:p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-gray-900">Price Range</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>৳{filters.priceRange[0]}</span>
                  <span>৳{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-gray-900">Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map(rating => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.rating === rating}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        rating: parseInt(e.target.value)
                      }))}
                      className="form-radio text-blue-500"
                    />
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            {uniqueBrands.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-900">Brands</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uniqueBrands.map(brand => (
                    <label key={brand} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters(prev => ({
                              ...prev,
                              brands: [...prev.brands, brand]
                            }))
                          } else {
                            setFilters(prev => ({
                              ...prev,
                              brands: prev.brands.filter(b => b !== brand)
                            }))
                          }
                        }}
                        className="form-checkbox text-blue-500"
                      />
                      <span className="text-sm text-gray-900">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Other Filters */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters.freeShipping}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    freeShipping: e.target.checked
                  }))}
                  className="form-checkbox text-blue-500"
                />
                <span className="text-sm text-gray-900">Free Shipping</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    inStock: e.target.checked
                  }))}
                  className="form-checkbox text-blue-500"
                />
                <span className="text-sm text-gray-900">In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-gray-700">Filters</span>
                </button>

                {/* Sort */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-all ${
                      viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Eye className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative overflow-hidden bg-gray-100 ${
                      viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'
                    }`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop'
                        }}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 space-y-1">
                        {product.discount && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                            -{product.discount}%
                          </span>
                        )}
                        {product.isNew && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                            New
                          </span>
                        )}
                        {product.isBestseller && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                            Bestseller
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`p-2 rounded-full shadow-lg transition-colors ${
                            wishlist.includes(product.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-600 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button className="p-2 bg-white text-gray-600 hover:text-blue-500 rounded-full shadow-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Free Shipping Badge */}
                      {product.freeShipping && (
                        <div className="absolute bottom-2 left-2">
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center shadow-md">
                            <Truck className="w-3 h-3 mr-1" />
                            Free Shipping
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className={`p-4 flex-1 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                      <div>
                        {/* Product Name */}
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                          <Link href={`/product/${product.id}`} className="block">
                            {product.name}
                          </Link>
                        </h3>

                        {/* Price */}
                        <div className="mb-3">
                          <span className="text-lg font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ৳{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="mb-4">
                          <span className={`text-sm font-medium ${
                            product.inStock 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {/* View Product Button */}
                      <Link
                        href={`/product/${product.id}`}
                        className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transform hover:scale-[1.02] text-decoration-none"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Product</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button (optional) */}
            {filteredProducts.length > 0 && (
              <div className="mt-8 text-center">
                <button className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListing