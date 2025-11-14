'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../Provider/Authcontext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No user logged in, redirect to login
        router.push('/login')
      } else if (!user.isAdmin) {
        // User is logged in but not admin, redirect to home
        router.push('/')
      }
    }
  }, [user, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user is not authenticated or not admin
  if (!user || !user.isAdmin) {
    return null
  }

  return <>{children}</>
}
