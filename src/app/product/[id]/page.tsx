'use client'

import ProductDetails from '@/components/ProductDetails/ProductDetails'
import { useParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id

  return (
    <div className="">
      
      <ProductDetails></ProductDetails>
    </div>
  )
}