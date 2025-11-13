'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Heart,
  Star,
  ArrowLeft,
  Truck,
  ShoppingCart,
  TrendingUp
} from 'lucide-react'
import { useFavorites } from '../Provider/FavoritesContext'

// Color name to hex mapping
const COLOR_MAP: { [key: string]: string } = {
  'red': '#EF4444',
  'blue': '#3B82F6',
  'green': '#10B981',
  'yellow': '#F59E0B',
  'black': '#000000',
  'white': '#FFFFFF',
  'pink': '#EC4899',
  'purple': '#A855F7',
  'orange': '#F97316',
  'brown': '#92400E',
  'gray': '#6B7280',
  'grey': '#6B7280',
  'navy': '#1E3A8A',
  'maroon': '#7F1D1D',
  'teal': '#14B8A6',
  'olive': '#84CC16',
  'lime': '#84CC16',
  'cyan': '#06B6D4',
  'magenta': '#D946EF',
  'crimson': '#DC2626',
  'beige': '#D4A373',
  'cream': '#FFFDD0',
  'gold': '#FFD700',
  'silver': '#C0C0C0',
  'khaki': '#C3B091'
}

const getColorHex = (colorName: string): string => {
  const normalized = colorName.toLowerCase().trim()
  return COLOR_MAP[normalized] || '#9CA3AF'
}

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
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites()

  const category = searchParams.get('category') || 'all'
  const subcategory = searchParams.get('subcategory') || ''
  const onSale = searchParams.get('onSale') === 'true'

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState('popularity')
  const [loading, setLoading] = useState(true)

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
  }, [category, subcategory, onSale])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      if (category && category !== 'all' && category !== 'sale') {
        params.append('category', category)
      }
      if (subcategory) {
        params.append('subcategory', subcategory)
      }
      if (onSale) {
        params.append('onSale', 'true')
      }

      const response = await fetch(`/api/products?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()

      if (data.success && data.products) {
        // If it's sale category, filter products with discount
        let productsToShow = data.products
        if (onSale || category === 'sale') {
          productsToShow = data.products.filter((p: Product) =>
            p.originalPrice && p.originalPrice > p.price
          )
        }
        setProducts(productsToShow)
        setFilteredProducts(productsToShow)
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
      default:
        filtered.sort((a, b) => b.reviews - a.reviews)
    }

    setFilteredProducts(filtered)
  }, [products, filters, sortBy])

  const toggleWishlist = (product: Product) => {
    if (isFavorite(product._id)) {
      removeFromFavorites(product._id)
    } else {
      addToFavorites({
        _id: product._id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0] || '',
        category: product.category,
        inStock: product.inStock
      })
    }
  }

  const getCategoryTitle = () => {
    if (onSale || category === 'sale') return 'Sale & Offers'
    const titles: { [key: string]: string } = {
      lungi: 'Lungi Collection',
      panjabi: 'Panjabi Collection',
      others: 'Accessories & Others',
      all: 'All Products'
    }
    return titles[category] || 'Products'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left: Back & Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{getCategoryTitle()}</h1>
                <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} products available</p>
              </div>
            </div>

            {/* Right: Sort */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white text-gray-700"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or explore other categories</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group border border-gray-100"
              >
                {/* Image Container */}
                <Link href={`/product/${product._id}`} className="block relative">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=500&fit=crop'
                      }}
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.discount && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}% OFF
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                          NEW
                        </span>
                      )}
                      {product.isBestseller && (
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleWishlist(product)
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                        isFavorite(product._id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite(product._id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Free Shipping */}
                    {product.freeShipping && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          FREE SHIPPING
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  {/* Brand */}
                  {product.brand && (
                    <p className="text-xs text-blue-600 font-semibold uppercase mb-2">
                      {product.brand}
                    </p>
                  )}

                  {/* Name */}
                  <Link href={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors min-h-[3rem] text-base">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold text-gray-900">
                        ৳{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-sm text-green-600 font-semibold">
                        Save ৳{(product.originalPrice - product.price).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Stock Status */}
                  <div className="mb-4">
                    <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${
                      product.inStock
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </span>
                  </div>

                  {/* View Details Button */}
                  <Link
                    href={`/product/${product._id}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductListingAPI
