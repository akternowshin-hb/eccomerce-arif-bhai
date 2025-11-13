'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '../DashboardLayout'
import {
  Save,
  X,
  Upload,
  ArrowLeft,
  Loader2,
  Plus
} from 'lucide-react'
import Link from 'next/link'

interface Product {
  _id?: string
  name: string
  description: string
  price: number | string
  originalPrice?: number | string
  discount?: number
  category: string
  subcategory?: string
  brand?: string
  stock: number | string
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
  isNew: boolean
  isBestseller: boolean
  featured: boolean
}

// Predefined color options
const PREDEFINED_COLORS = [
  'Red', 'Blue', 'Green', 'Yellow', 'Black', 'White',
  'Pink', 'Purple', 'Orange', 'Brown', 'Gray', 'Navy',
  'Maroon', 'Teal', 'Olive', 'Lime', 'Cyan', 'Magenta'
]

const ManageProductsPage: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const productId = searchParams.get('id')

  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingProduct, setIsFetchingProduct] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [newColorInput, setNewColorInput] = useState('')
  const [newSizeInput, setNewSizeInput] = useState('')
  const [availableColors, setAvailableColors] = useState<string[]>(PREDEFINED_COLORS)

  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'lungi',
    subcategory: '',
    brand: '',
    stock: '',
    inStock: true,
    images: [],
    sizes: [],
    colors: [],
    material: '',
    weight: '',
    care: '',
    fit: '',
    rating: 0,
    numReviews: 0,
    isNew: false,
    isBestseller: false,
    featured: false
  })

  // Fetch product data when editing
  useEffect(() => {
    if (action === 'edit' && productId) {
      fetchProduct(productId)
    }
  }, [action, productId])

  const fetchProduct = async (id: string) => {
    try {
      setIsFetchingProduct(true)
      console.log('Fetching product:', id)

      const response = await fetch(`/api/products/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Fetched product data:', data)

      if (data.success && data.product) {
        const product = data.product

        // Set form data with all product fields
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          originalPrice: product.originalPrice || '',
          category: product.category || 'lungi',
          subcategory: product.subcategory || '',
          brand: product.brand || '',
          stock: product.stock || 0,
          inStock: product.inStock ?? true,
          images: product.images || [],
          sizes: product.sizes || [],
          colors: product.colors || [],
          material: product.material || '',
          weight: product.weight || '',
          care: product.care || '',
          fit: product.fit || '',
          rating: product.rating || 0,
          numReviews: product.numReviews || 0,
          isNew: product.isNew || false,
          isBestseller: product.isBestseller || false,
          featured: product.featured || false
        })

        // Set image previews
        if (product.images && product.images.length > 0) {
          setImagePreviews(product.images)
        }

        // Add any custom colors from product to available colors
        if (product.colors && product.colors.length > 0) {
          const customColors = product.colors.filter(
            (color: string) => !PREDEFINED_COLORS.includes(color)
          )
          if (customColors.length > 0) {
            setAvailableColors([...PREDEFINED_COLORS, ...customColors])
          }
        }
      } else {
        throw new Error(data.message || 'Failed to fetch product')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Failed to fetch product details. Please try again.')
      router.push('/dashboard/products')
    } finally {
      setIsFetchingProduct(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    setUploadingImages(true)
    const newPreviews: string[] = []
    const newImages: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB.`)
          continue
        }

        // Convert to base64
        const base64 = await convertToBase64(file)
        newPreviews.push(base64)
        newImages.push(base64)
      }

      setImagePreviews(prev => [...prev, ...newPreviews])
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }))
    } catch (error) {
      console.error('Error processing images:', error)
      alert('Failed to process some images')
    } finally {
      setUploadingImages(false)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Color management
  const toggleColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  const addNewColor = () => {
    const trimmedColor = newColorInput.trim()
    if (trimmedColor && !availableColors.includes(trimmedColor)) {
      setAvailableColors([...availableColors, trimmedColor])
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, trimmedColor]
      }))
      setNewColorInput('')
    } else if (trimmedColor && availableColors.includes(trimmedColor)) {
      // If color already exists in available colors, just select it
      if (!formData.colors.includes(trimmedColor)) {
        setFormData(prev => ({
          ...prev,
          colors: [...prev.colors, trimmedColor]
        }))
      }
      setNewColorInput('')
    }
  }

  // Size management
  const addSize = () => {
    const trimmedSize = newSizeInput.trim()
    if (trimmedSize && !formData.sizes.includes(trimmedSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, trimmedSize]
      }))
      setNewSizeInput('')
    }
  }

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      alert('Product name is required')
      return
    }

    if (!formData.description.trim()) {
      alert('Product description is required')
      return
    }

    if (!formData.price || parseFloat(formData.price as string) <= 0) {
      alert('Valid price is required')
      return
    }

    if (!formData.stock || parseInt(formData.stock as string) < 0) {
      alert('Valid stock quantity is required')
      return
    }

    if (formData.images.length === 0) {
      alert('At least one product image is required')
      return
    }

    setIsLoading(true)

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price as string),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice as string) : undefined,
        stock: parseInt(formData.stock as string),
        inStock: parseInt(formData.stock as string) > 0
      }

      const url = action === 'edit' ? `/api/products/${productId}` : '/api/products'
      const method = action === 'edit' ? 'PUT' : 'POST'

      console.log(`${method} request to:`, url)
      console.log('Submit data:', submitData)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()
      console.log('Response:', data)

      if (response.ok && data.success) {
        alert(action === 'edit' ? 'Product updated successfully!' : 'Product created successfully!')
        router.push('/dashboard/products')
      } else {
        throw new Error(data.message || 'Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert(error instanceof Error ? error.message : 'Failed to save product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while fetching product
  if (isFetchingProduct) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 text-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/products"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {action === 'edit' ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-gray-600 mt-1">
                {action === 'edit'
                  ? `Editing: ${formData.name || 'Product'}`
                  : 'Create a new product listing'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lungi">Lungi</option>
                  <option value="panjabi">Panjabi</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., cotton, silk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brand name"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (৳) *
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original Price (৳)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="For showing discount"
                />
              </div>
            </div>
          </div>

          {/* Inventory & Stock */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter stock quantity"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 100% Cotton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 140 GSM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care Instructions
                </label>
                <input
                  type="text"
                  name="care"
                  value={formData.care || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Machine Wash"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fit
                </label>
                <input
                  type="text"
                  name="fit"
                  value={formData.fit || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Regular Fit"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Product Images *</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB each)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                </label>
              </div>
            </div>

            {uploadingImages && (
              <div className="text-center py-2">
                <Loader2 className="animate-spin h-6 w-6 text-blue-500 mx-auto" />
                <p className="text-sm text-gray-600 mt-2">Processing images...</p>
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imagePreviews.length === 0 && !uploadingImages && (
              <div className="text-center py-4 text-red-600 text-sm">
                ⚠️ At least one image is required
              </div>
            )}
          </div>

          {/* Colors with Checkboxes */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Colors</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableColors.map((color) => (
                <label
                  key={color}
                  className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.colors.includes(color)}
                    onChange={() => toggleColor(color)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{color}</span>
                </label>
              ))}
            </div>

            {/* Add New Color */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newColorInput}
                onChange={(e) => setNewColorInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addNewColor()
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add new color (e.g., Crimson)"
              />
              <button
                type="button"
                onClick={addNewColor}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {formData.colors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected: {formData.colors.join(', ')}</p>
              </div>
            )}
          </div>

          {/* Sizes with Tags */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Sizes</h3>

            {/* Add Size Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSizeInput}
                onChange={(e) => setNewSizeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSize()
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add size (e.g., XL, 42, Large)"
              />
              <button
                type="button"
                onClick={addSize}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Display Selected Sizes as Tags */}
            {formData.sizes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size) => (
                  <div
                    key={size}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg"
                  >
                    <span className="text-sm font-medium">{size}</span>
                    <button
                      type="button"
                      onClick={() => removeSize(size)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Featured Product</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Mark as New</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isBestseller"
                  checked={formData.isBestseller}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Bestseller</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isLoading || uploadingImages || imagePreviews.length === 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {action === 'edit' ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
            <Link
              href="/dashboard/products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default ManageProductsPage
