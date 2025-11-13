// models/Product.ts
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['lungi', 'panjabi', 'traditional', 'others'],
      lowercase: true
    },
    subcategory: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    inStock: {
      type: Boolean,
      default: true
    },
    images: {
      type: [String],
      validate: {
        validator: function(v: string[]) {
          return v && v.length > 0
        },
        message: 'At least one image is required'
      }
    },
    featured: {
      type: Boolean,
      default: false
    },
    isNew: {
      type: Boolean,
      default: false
    },
    isBestseller: {
      type: Boolean,
      default: false
    },
    sizes: [String],
    colors: [String],
    materials: [String],
    tags: [String],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    },
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Indexes for better query performance
ProductSchema.index({ category: 1, featured: -1 })
ProductSchema.index({ name: 'text', description: 'text' })
ProductSchema.index({ createdAt: -1 })

// Pre-save hook to update inStock based on stock quantity
ProductSchema.pre('save', function(next) {
  this.inStock = this.stock > 0
  next()
})

// Prevent model recompilation in development
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

export default Product