'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  _id: string
  name: string
  price: number
  image: string
  quantity: number
  size?: string
  color?: string
  stock: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeFromCart: (id: string, size?: string, color?: string) => void
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, isLoaded])

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) =>
          cartItem._id === item._id &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      )

      if (existingItemIndex > -1) {
        // Item exists, update quantity
        const updatedCart = [...prevCart]
        const newQuantity = updatedCart[existingItemIndex].quantity + quantity

        // Check if new quantity exceeds stock
        if (newQuantity <= item.stock) {
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: newQuantity
          }
          return updatedCart
        } else {
          // Don't exceed stock
          alert(`Cannot add more than ${item.stock} items`)
          return prevCart
        }
      } else {
        // New item, add to cart
        if (quantity <= item.stock) {
          return [...prevCart, { ...item, quantity }]
        } else {
          alert(`Cannot add more than ${item.stock} items`)
          return prevCart
        }
      }
    })
  }

  const removeFromCart = (id: string, size?: string, color?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item._id === id && item.size === size && item.color === color)
      )
    )
  }

  const updateQuantity = (id: string, quantity: number, size?: string, color?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item._id === id && item.size === size && item.color === color) {
          if (quantity <= item.stock) {
            return { ...item, quantity }
          } else {
            alert(`Cannot add more than ${item.stock} items`)
            return item
          }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
