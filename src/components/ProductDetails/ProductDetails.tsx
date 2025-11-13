'use client'

import React, { useState, useRef } from 'react'
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
  Info
} from 'lucide-react'

interface ProductImage {
  id: number
  url: string
  alt: string
}

interface ProductVariant {
  id: number
  color: string
  colorCode: string
  name: string
  images: ProductImage[]
}

interface SizeOption {
  size: string
  available: boolean
  stock?: number
}

const ProductDetails: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [selectedSize, setSelectedSize] = useState('XL')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const productVariants: ProductVariant[] = [
    {
      id: 1,
      color: 'White',
      colorCode: '#ffffff',
      name: 'Classic White',
      images: [
        { id: 1, url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop', alt: 'White Dobby Shirt Front' },
        { id: 2, url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=800&fit=crop', alt: 'White Dobby Shirt Back' },
        { id: 3, url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop', alt: 'White Dobby Shirt Side' }
      ]
    },
    {
      id: 2,
      color: 'Light Blue',
      colorCode: '#87ceeb',
      name: 'Sky Blue',
      images: [
        { id: 5, url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop', alt: 'Blue Dobby Shirt Front' },
        { id: 6, url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=800&fit=crop', alt: 'Blue Dobby Shirt Back' }
      ]
    },
    {
      id: 3,
      color: 'Gray',
      colorCode: '#808080',
      name: 'Classic Gray',
      images: [
        { id: 8, url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&h=800&fit=crop', alt: 'Gray Dobby Shirt Front' },
        { id: 9, url: 'https://images.unsplash.com/photo-1594938395241-7d4ac882b4c8?w=600&h=800&fit=crop', alt: 'Gray Dobby Shirt Back' }
      ]
    }
  ]

  const sizeOptions: SizeOption[] = [
    { size: 'S', available: true, stock: 5 },
    { size: 'M', available: true, stock: 12 },
    { size: 'L', available: true, stock: 8 },
    { size: 'XL', available: true, stock: 15 },
    { size: '2XL', available: true, stock: 3 },
    { size: '3XL', available: false, stock: 0 }
  ]

  const currentVariant = productVariants[selectedVariant]
  const currentImages = currentVariant.images

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === currentImages.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? currentImages.length - 1 : prev - 1
    )
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
                  src={currentImages[selectedImageIndex]?.url}
                  alt={currentImages[selectedImageIndex]?.alt}
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isZooming ? 'scale-300' : 'scale-100'
                  }`}
                  style={isZooming ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                  } : {}}
                />
                
                {/* Simple Navigation */}
                {currentImages.length > 1 && !isZooming && (
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
                  {selectedImageIndex + 1}/{currentImages.length}
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
            <div className="flex space-x-2">
              {currentImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-14 h-14 rounded overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info - Simplified */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Premium Dobby Shirt
              </h1>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">4.8 • 127 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="py-4 px-4 bg-gray-50 rounded-lg">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">৳5,800</span>
                <span className="text-lg text-gray-500 line-through">৳7,200</span>
                <span className="bg-red-600 text-white px-2 py-0.5 rounded text-sm font-medium">
                  19% OFF
                </span>
              </div>
            </div>

            {/* Color */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Color: {currentVariant.name}
              </h3>
              <div className="flex space-x-2">
                {productVariants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(index)
                      setSelectedImageIndex(0)
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedVariant === index
                        ? 'border-black'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: variant.colorCode }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Size: {selectedSize}</h3>
                <button className="text-blue-600 text-sm hover:underline flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  Size Guide
                </button>
              </div>
              <div className="flex space-x-2">
                {sizeOptions.map((option) => (
                  <button
                    key={option.size}
                    onClick={() => option.available && setSelectedSize(option.size)}
                    disabled={!option.available}
                    className={`px-3 py-2 text-sm rounded border transition-all ${
                      selectedSize === option.size
                        ? 'border-black bg-black text-white'
                        : option.available
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {option.size}
                  </button>
                ))}
              </div>
            </div>

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
                    disabled={quantity >= 10}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {sizeOptions.find(s => s.size === selectedSize)?.stock} available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors">
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Add to Cart
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-blue-600 text-white py-2.5 rounded font-medium hover:bg-blue-700 transition-colors">
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
                <p className="text-gray-700">
                  Experience comfort and style with our Premium Dobby Shirt. Crafted from high-quality dobby fabric, 
                  this shirt offers exceptional breathability and durability.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Premium dobby fabric with superior breathability</li>
                  <li>• Easy care - wrinkle resistant and machine washable</li>
                  <li>• Classic fit with modern styling</li>
                  <li>• Pre-shrunk for lasting fit</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Fabric</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Material:</span>
                      <span>100% Cotton</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span>140 GSM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Care:</span>
                      <span>Machine Wash</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Fit:</span>
                      <span>Regular</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Collar:</span>
                      <span>Spread</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sleeve:</span>
                      <span>Full</span>
                    </div>
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
                
                <div className="space-y-3">
                  {[
                    { name: 'Ahmed R.', rating: 5, text: 'Excellent quality! Very comfortable and fits perfectly.' },
                    { name: 'Fatima K.', rating: 4, text: 'Good shirt for the price. Color exactly as shown.' },
                    { name: 'Karim M.', rating: 5, text: 'Fast delivery and great quality. Will buy again!' }
                  ].map((review, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex items-center mb-1">
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.name}</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">Shipping</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>• Free delivery on orders over ৳500</p>
                    <p>• 1-3 business days in Dhaka</p>
                    <p>• 3-5 days outside Dhaka</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Returns</h4>
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