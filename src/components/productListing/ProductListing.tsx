'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Heart, 
  Star, 
  Eye, 
  Filter, 
  ArrowLeft,
  Truck,
  X,
  Search
} from 'lucide-react'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  rating: number
  reviews: number
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
  freeShipping: boolean
  inStock: boolean
}

const ProductListingAPI: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const category = searchParams.get('category') || 'all'
  const subcategory = searchParams.get('subcategory') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState('popularity')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<string[]>([])

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    rating: 0,
    brands: [],
    freeShipping: false,
    inStock: false
  })

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [category, subcategory])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Build query params
      const params = new URLSearchParams()
      if (category && category !== 'all') {
        params.append('category', category)
      }
      if (subcategory) {
        params.append('subcategory', subcategory)
      }
      
      const response = await fetch(`/api/products?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      
      if (data.success && data.products) {
        setProducts(data.products)
        setFilteredProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters and sorting
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
      filtered = filtered.filter(product => 
        product.brand && filters.brands.includes(product.brand)
      )
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

  const toggleWishlist = (productId: string) => {
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

  const uniqueBrands = [...new Set(
    products
      .map(p => p.brand)
      .filter((brand): brand is string => brand !== undefined && brand !== null)
  )]

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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-gray-700">Filters</span>
                </button>

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
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Eye className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-gray-100 aspect-square">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop'}
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

                      {/* Wishlist Button */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className={`p-2 rounded-full shadow-lg transition-colors ${
                            wishlist.includes(product._id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-gray-600 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(product._id) ? 'fill-current' : ''}`} />
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
                    <div className="p-4 flex-1">
                      <div>
                        {/* Product Name */}
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors h-12">
                          <Link href={`/product/${product._id}`} className="block">
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
                            product.inStock ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {/* View Product Button */}
                      <Link
                        href={`/product/${product._id}`}
                        className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Product</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListingAPI