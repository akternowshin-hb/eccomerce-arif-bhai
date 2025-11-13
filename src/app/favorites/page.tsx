'use client'

import React from 'react'
import { useFavorites } from '@/components/Provider/FavoritesContext'
import Link from 'next/link'
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/components/Provider/CartContext'

export default function FavoritesPage() {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites()
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = (item: any) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      stock: 100 // Default stock, you may want to fetch real stock
    })
    alert('Product added to cart!')
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No favorites yet</h2>
          <p className="text-gray-600 mb-8">Start adding products to your favorites!</p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
            <button
              onClick={clearFavorites}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
          <p className="text-gray-600 mt-2">{favorites.length} items in your favorites</p>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <Link href={`/product/${item._id}`} className="block relative aspect-square">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="p-4">
                <Link href={`/product/${item._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                <div className="mb-3">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ৳{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ৳{item.originalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-3 capitalize">{item.category}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.inStock}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromFavorites(item._id)}
                    className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
