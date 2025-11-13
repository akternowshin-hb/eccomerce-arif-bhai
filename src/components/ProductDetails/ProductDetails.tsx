'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Heart,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Info,
  Loader2
} from 'lucide-react'
import { useCart } from '../Provider/CartContext'

// Color name to hex mapping
const COLOR_MAP: { [key: string]: string } = {
  // Basic colors
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
  return COLOR_MAP[normalized] || '#9CA3AF' // Default to gray if color not found
}

interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  subcategory?: string
  brand?: string
  stock: number
  inStock: boolean
  images: string[]
  sizes: string[]
  colors: string[]
  material?: string
  weight?: string
  care?: string
  fit?: string
  rating?: number
  numReviews?: number
  featured?: boolean
  isNew?: boolean
  isBestseller?: boolean
}

const ProductDetails: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  const { addToCart } = useCart()

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${productId}`)

        if (!response.ok) {
          throw new Error('Product not found')
        }

        const data = await response.json()

        if (data.success && data.product) {
          setProduct(data.product)
          // Set default selections
          if (data.product.colors && data.product.colors.length > 0) {
            setSelectedColor(data.product.colors[0])
          }
          if (data.product.sizes && data.product.sizes.length > 0) {
            setSelectedSize(data.product.sizes[0])
          }
        } else {
          throw new Error(data.message || 'Failed to fetch product')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addToCart(
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        stock: product.stock
      },
      quantity
    )

    alert('Product added to cart!')
  }

  const nextImage = () => {
    if (product) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (product) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsZooming(true)
  }

  const handleMouseLeave = () => {
    setIsZooming(false)
  }

  // Calculate discount percentage
  const discountPercentage = product?.originalPrice && product?.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  // Loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen text-blue-500">
      {/* Minimal Header */}
      <div className="border-b sticky top-0 z-40 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-full transition-all ${
                isFavorite ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Product Images - Enhanced */}
          <div className="space-y-3">
            {/* Main Image with 3x Zoom */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden">
              <div
                ref={imageRef}
                className="relative aspect-square cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isZooming ? 'scale-300' : 'scale-100'
                  }`}
                  style={isZooming ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : {}}
                />

                {/* Simple Navigation */}
                {product.images.length > 1 && !isZooming && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-1.5 hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 rounded-full p-1.5 hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {selectedImageIndex + 1}/{product.images.length}
                </div>

                {/* Zoom Hint */}
                {!isZooming && (
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    Hover to zoom
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info - Simplified */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-sm text-gray-600 mb-2">Brand: {product.brand}</p>
              )}
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating?.toFixed(1) || '0.0'} • {product.numReviews || 0} reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">৳{product.price.toLocaleString()}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-sm font-medium">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Color */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Color: {selectedColor}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative flex items-center gap-2 transition-all ${
                        selectedColor === color
                          ? 'ring-2 ring-black ring-offset-2'
                          : ''
                      }`}
                      title={color}
                    >
                      <div
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-black scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        } ${color.toLowerCase() === 'white' ? 'border-gray-400' : ''}`}
                        style={{
                          backgroundColor: getColorHex(color)
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">Size: {selectedSize}</h3>
                  <button className="text-blue-600 text-sm hover:underline flex items-center">
                    <Info className="w-3 h-3 mr-1" />
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 text-sm rounded border transition-all ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  className="bg-blue-600 text-white py-2.5 rounded font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  disabled={!product.inStock}
                >
                  Buy Now
                </button>
                <button className="border border-gray-300 py-2.5 rounded font-medium hover:bg-gray-50 transition-colors">
                  Ask Question
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center py-3 bg-green-50 rounded">
                <Truck className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Free Shipping</p>
              </div>

              <div className="text-center py-3 bg-blue-50 rounded">
                <RotateCcw className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Easy Returns</p>
              </div>

              <div className="text-center py-3 bg-purple-50 rounded">
                <Shield className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Product Details */}
        <div className="mt-10 border rounded-lg">
          <div className="border-b">
            <nav className="flex space-x-6 px-4">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Details' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'shipping', label: 'Shipping' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4">
            {activeTab === 'description' && (
              <div className="space-y-3">
                <p className="text-gray-700 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-3 text-gray-900">Details</h4>
                  <div className="space-y-2 text-gray-600">
                    {product.material && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Material:</span>
                        <span>{product.material}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Weight:</span>
                        <span>{product.weight}</span>
                      </div>
                    )}
                    {product.care && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Care:</span>
                        <span>{product.care}</span>
                      </div>
                    )}
                    {product.fit && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Fit:</span>
                        <span>{product.fit}</span>
                      </div>
                    )}
                    {product.category && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Category:</span>
                        <span className="capitalize">{product.category}</span>
                      </div>
                    )}
                    {product.subcategory && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Subcategory:</span>
                        <span>{product.subcategory}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Customer Reviews</h3>
                  <button className="bg-black text-white px-3 py-1.5 rounded text-sm hover:bg-gray-800">
                    Write Review
                  </button>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-3 text-gray-900">Shipping</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>• Free delivery on orders over ৳500</p>
                    <p>• 1-3 business days in Dhaka</p>
                    <p>• 3-5 days outside Dhaka</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-gray-900">Returns</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>• 7 days easy returns</p>
                    <p>• Free return pickup</p>
                    <p>• 1 year quality warranty</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductDetails
