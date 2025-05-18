'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Auth from '@/components/Auth'
import Navigation from '@/components/Navigation'

export default function LoginPage() {
  const { user } = useAuth()
  const router = useRouter()
  
  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])
  
  return (
    <main>
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Auth />
      </div>
    </main>
  )
}