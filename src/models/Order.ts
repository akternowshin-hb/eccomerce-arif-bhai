import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image: string
}

export interface IShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
  postalCode?: string
  country: string
}

export interface IOrder extends Document {
  userId: string // Firebase UID
  orderNumber: string
  items: IOrderItem[]
  shippingAddress: IShippingAddress
  paymentMethod: 'COD' | 'Online' | 'Card'
  paymentStatus: 'Pending' | 'Paid' | 'Failed'
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  notes?: string
  createdAt: Date
  updatedAt: Date
  deliveredAt?: Date
}

const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: String,
  color: String,
  image: {
    type: String,
    required: true
  }
})

const ShippingAddressSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postalCode: String,
  country: {
    type: String,
    required: true,
    default: 'Bangladesh'
  }
})

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    orderNumber: {
      type: String,
      unique: true,
      index: true
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function(items: IOrderItem[]) {
          return items.length > 0
        },
        message: 'Order must have at least one item'
      }
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Online', 'Card'],
      required: true,
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    notes: String,
    deliveredAt: Date
  },
  {
    timestamps: true
  }
)

// Auto-update payment status for COD when delivered
OrderSchema.pre('save', function(next) {
  if (this.paymentMethod === 'COD' && this.orderStatus === 'Delivered') {
    this.paymentStatus = 'Paid'
    if (!this.deliveredAt) {
      this.deliveredAt = new Date()
    }
  }
  next()
})

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)

export default Order
