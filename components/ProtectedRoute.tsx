'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/lib/supabase'

type ProtectedRouteProps = {
  children: React.ReactNode
  requiredRoles?: UserRole[]
}

export default function ProtectedRoute({ 
  children, 
  requiredRoles 
}: ProtectedRouteProps) {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push('/login')
        return
      }

      // If specific roles are required, check if user has one of them
      if (requiredRoles && requiredRoles.length > 0) {
        if (!userRole || !requiredRoles.includes(userRole)) {
          router.push('/unauthorized')
          return
        }
      }
    }
  }, [user, loading, userRole, requiredRoles, router])

  // While checking authentication, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // If not authenticated or doesn't have required role, don't render children
  if (!user || (requiredRoles && requiredRoles.length > 0 && (!userRole || !requiredRoles.includes(userRole)))) {
    return null
  }

  // User is authenticated and has required role (if any), render children
  return <>{children}</>
}