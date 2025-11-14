'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Define types
interface User {
  _id: string
  name: string
  email: string
  phone: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  // Register with email and password
  const register = async (userData: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed')
      }

      // Save user to state and localStorage
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))

      router.push('/') // Redirect to home page
    } catch (error: any) {
      console.error('Registration error:', error)
      throw error
    }
  }

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed')
      }

      // Save user to state and localStorage
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect based on user type
      if (data.user.isAdmin) {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/login')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
