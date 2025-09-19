'use client'

import React, { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Heart,
  Share2,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Camera,
  Zap,
  Gift,
  CreditCard,
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
  const productId = params.id as string

  console.log('Product ID:', productId)

  const productVariants: ProductVariant[] = [
    {
      id: 1,
      color: 'White',
      colorCode: '#ffffff',
      name: 'Classic White',
      images: [
        { id: 1, url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop', alt: 'White Dobby Shirt Front' },
        { id: 2, url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=800&fit=crop', alt: 'White Dobby Shirt Back' },
        { id: 3, url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop', alt: 'White Dobby Shirt Side' },
        { id: 4, url: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=800&fit=crop', alt: 'White Dobby Shirt Detail' }
      ]
    },
    {
      id: 2,
      color: 'Light Blue',
      colorCode: '#87ceeb',
      name: 'Sky Blue',
      images: [
        { id: 5, url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop', alt: 'Blue Dobby Shirt Front' },
        { id: 6, url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=800&fit=crop', alt: 'Blue Dobby Shirt Back' },
        { id: 7, url: 'https://images.unsplash.com/photo-1594938307590-df4842e97bdc?w=600&h=800&fit=crop', alt: 'Blue Dobby Shirt Side' }
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
    <div className="bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/category" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Categories
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`p-2 rounded-full transition-all ${
                  isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image with Zoom Effect */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
              <div 
                ref={imageRef}
                className="relative aspect-square cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={currentImages[selectedImageIndex]?.url}
                    alt={currentImages[selectedImageIndex]?.alt}
                    className={`w-full h-full object-cover transition-transform duration-200 ${
                      isZooming ? 'scale-150' : 'scale-100'
                    }`}
                    style={isZooming ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                    } : {}}
                  />
                </div>
                
                {/* Zoom Indicator */}
                {!isZooming && (
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all">
                    <Camera className="w-5 h-5 text-gray-800" />
                  </div>
                )}
                
                {/* Zoom Instructions */}
                {!isZooming && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    Hover to zoom
                  </div>
                )}
                
                {/* Image Navigation */}
                {currentImages.length > 1 && !isZooming && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {!isZooming && (
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImageIndex + 1} / {currentImages.length}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {currentImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-blue-300'
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

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Easy Care & Premium Dobby Shirt
              </h1>
              <p className="text-lg text-gray-600 mb-4">প্রিমিয়াম ডবি শার্ট</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8 • 127 reviews)</span>
                </div>
                <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  ✓ Verified Quality
                </span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>SKU: MENSHI/006132</span>
                <span>•</span>
                <span>Brand: LungiLok</span>
                <span>•</span>
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Made in Bangladesh
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">৳ 5,800.00</span>
                <span className="text-xl text-gray-500 line-through">৳ 7,200.00</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  19% OFF
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Limited time offer • Ends in 2 days
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Color: {currentVariant.name}
              </h3>
              <div className="flex space-x-3">
                {productVariants.map((variant, index) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(index)
                      setSelectedImageIndex(0)
                    }}
                    className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                      selectedVariant === index
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-300 hover:border-blue-300'
                    }`}
                    style={{ backgroundColor: variant.colorCode }}
                  >
                    {selectedVariant === index && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Size: {selectedSize}
                </h3>
                <button className="text-blue-600 text-sm hover:underline flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {sizeOptions.map((option) => (
                  <button
                    key={option.size}
                    onClick={() => option.available && setSelectedSize(option.size)}
                    disabled={!option.available}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      selectedSize === option.size
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : option.available
                        ? 'border-gray-300 hover:border-blue-300 text-gray-700'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="font-semibold">{option.size}</div>
                    {option.available && option.stock && (
                      <div className="text-xs text-gray-500">{option.stock} left</div>
                    )}
                    {!option.available && (
                      <div className="text-xs text-red-500">Out of stock</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white rounded-lg border-2 border-gray-300">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="p-2 text-gray-600 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {sizeOptions.find(s => s.size === selectedSize)?.stock} pieces available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] shadow-lg">
                <ShoppingCart className="w-6 h-6 inline mr-2" />
                Add to Cart
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button className="bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all">
                  <Zap className="w-5 h-5 inline mr-2" />
                  Buy Now
                </button>
                <button className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all">
                  <Gift className="w-5 h-5 inline mr-2" />
                  Gift This
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-600">Orders over ৳500</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <RotateCcw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">7 Days Return</p>
                  <p className="text-sm text-gray-600">Easy returns</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Warranty</p>
                  <p className="text-sm text-gray-600">1 year quality</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Premium Quality</p>
                  <p className="text-sm text-gray-600">Certified fabric</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </h4>
              <div className="flex space-x-2 flex-wrap">
                {['Cash on Delivery', 'bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard'].map((method) => (
                  <span key={method} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews (127)' },
                { id: 'shipping', label: 'Shipping & Returns' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                <p className="text-gray-700 mb-4">
                  Experience comfort and style with our Easy Care & Premium Dobby Shirt. Crafted from high-quality dobby fabric, 
                  this shirt offers exceptional breathability and durability, making it perfect for both formal and casual occasions.
                </p>
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Premium dobby fabric with superior breathability</li>
                  <li>Easy care - wrinkle resistant and machine washable</li>
                  <li>Classic fit with modern styling</li>
                  <li>Available in multiple colors and sizes</li>
                  <li>Pre-shrunk for lasting fit</li>
                  <li>Reinforced seams for durability</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Fabric Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Material:</span>
                      <span>100% Cotton Dobby</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span>140 GSM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Care:</span>
                      <span>Machine Wash</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Product Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fit:</span>
                      <span>Regular Fit</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Collar:</span>
                      <span>Spread Collar</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sleeve:</span>
                      <span>Full Sleeve</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Write Review
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Ahmed R.</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Excellent quality shirt! Very comfortable and fits perfectly. The fabric is breathable and looks premium."
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Fatima K.</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Good shirt for the price. Color is exactly as shown. Would recommend for formal wear."
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">Karim M.</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Fast delivery and great quality. The dobby texture adds a nice touch. Will buy again!"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Shipping Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Truck className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <p className="font-medium">Free Delivery</p>
                        <p className="text-sm text-gray-600">On orders above ৳500 within Dhaka</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium">Delivery Time</p>
                        <p className="text-sm text-gray-600">1-3 business days in Dhaka, 3-5 days outside</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Return Policy</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <RotateCcw className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-medium">7 Days Return</p>
                        <p className="text-sm text-gray-600">Easy returns within 7 days of delivery</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <p className="font-medium">Quality Guarantee</p>
                        <p className="text-sm text-gray-600">1 year warranty on fabric quality</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Options */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all">
              <Phone className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Call Us</p>
                <p className="text-sm text-gray-600">+880 1711-123456</p>
              </div>
            </button>
            
            <button className="flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">Live Chat</p>
                <p className="text-sm text-gray-600">Chat with us</p>
              </div>
            </button>
            
            <button className="flex items-center justify-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all">
              <MessageCircle className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">WhatsApp</p>
                <p className="text-sm text-gray-600">Message us</p>
              </div>
            </button>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                name: 'Cotton Casual Shirt',
                price: '৳ 4,200',
                originalPrice: '৳ 5,000',
                image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop',
                rating: 4.5,
                discount: '16% OFF'
              },
              {
                id: 2,
                name: 'Premium Panjabi',
                price: '৳ 6,800',
                originalPrice: '৳ 8,500',
                image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop',
                rating: 4.8,
                discount: '20% OFF'
              },
              {
                id: 3,
                name: 'Designer Kurta',
                price: '৳ 5,500',
                originalPrice: '৳ 7,200',
                image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=400&fit=crop',
                rating: 4.6,
                discount: '24% OFF'
              },
              {
                id: 4,
                name: 'Traditional Fatua',
                price: '৳ 3,800',
                originalPrice: '৳ 4,500',
                image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop',
                rating: 4.4,
                discount: '16% OFF'
              }
            ].map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.discount}
                    </span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Recently Viewed</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {[
              {
                id: 1,
                name: 'Classic Lungi',
                price: '৳ 2,200',
                image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&h=250&fit=crop'
              },
              {
                id: 2,
                name: 'Silk Panjabi',
                price: '৳ 7,500',
                image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=250&fit=crop'
              },
              {
                id: 3,
                name: 'Cotton Kurta',
                price: '৳ 4,800',
                image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&h=250&fit=crop'
              },
              {
                id: 4,
                name: 'Designer Shirt',
                price: '৳ 5,200',
                image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=250&fit=crop'
              }
            ].map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="flex-shrink-0 w-40 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-medium text-sm text-gray-900 mb-1 truncate">{item.name}</h4>
                  <p className="text-sm font-bold text-blue-600">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
            Why Choose <span className="text-blue-600">LungiLok</span>?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Authentic Products</h4>
              <p className="text-sm text-gray-600">100% genuine and quality assured</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast Delivery</h4>
              <p className="text-sm text-gray-600">Quick and reliable shipping</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Returns</h4>
              <p className="text-sm text-gray-600">Hassle-free return policy</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Best Quality</h4>
              <p className="text-sm text-gray-600">Premium materials and craftsmanship</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductDetails