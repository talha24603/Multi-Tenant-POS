"use client"

import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

interface TopProduct {
  id: string
  name: string
  category: string
  sales: number
  revenue: string
  trend: string
  percentage: string
  stock: number
  price: number
}

export function TopProducts() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopProducts()
  }, [])

  const fetchTopProducts = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/top-products')
      if (response.ok) {
        const data = await response.json()
        setTopProducts(data.topProducts)
      } else {
        console.error('Failed to fetch top products')
        setTopProducts([])
      }
    } catch (error) {
      console.error('Error fetching top products:', error)
      setTopProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (topProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No product sales data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {topProducts.map((product) => (
        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{product.sales} sales</span>
              <div className="flex items-center gap-1">
                {product.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${product.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {product.percentage}%
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{product.revenue}</p>
            <Badge variant="secondary" className="text-xs">
              Stock: {product.stock}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
} 