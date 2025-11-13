'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface FavoriteItem {
  _id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  inStock: boolean
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  addToFavorites: (item: FavoriteItem) => void
  removeFromFavorites: (id: string) => void
  isFavorite: (id: string) => boolean
  getFavoritesCount: () => number
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const addToFavorites = (item: FavoriteItem) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav._id === item._id)
      if (exists) {
        return prev
      }
      return [...prev, item]
    })
  }

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item._id !== id))
  }

  const isFavorite = (id: string) => {
    return favorites.some((item) => item._id === id)
  }

  const getFavoritesCount = () => {
    return favorites.length
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoritesCount,
        clearFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
