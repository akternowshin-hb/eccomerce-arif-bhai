'use client'

import { usePathname } from 'next/navigation'
import NavBar from '@/components/shared/NavBar'
import Footer from '@/components/Footer/Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isDashboard) {
    // Dashboard pages - no NavBar/Footer
    return <>{children}</>
  }

  // Regular pages - with NavBar/Footer
  return (
    <>
      <NavBar />
      <main className="min-h-screen text-gray-900">{children}</main>
      <Footer />
    </>
  )
}