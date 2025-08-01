"use client"

import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package } from "lucide-react"
import { useEffect, useState } from "react"

interface StockAlert {
  id: string
  name: string
  currentStock: number
  minStock: number
  category: string
  lastUpdated: string
  isOutOfStock: boolean
  isLowStock: boolean
}

export function StockAlerts() {
  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStockAlerts()
  }, [])

  const fetchStockAlerts = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stock-alerts')
      if (response.ok) {
        const data = await response.json()
        setStockAlerts(data.stockAlerts)
      } else {
        console.error('Failed to fetch stock alerts')
        setStockAlerts([])
      }
    } catch (error) {
      console.error('Error fetching stock alerts:', error)
      setStockAlerts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-200 rounded-full h-8 w-8"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-200 rounded w-8 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (stockAlerts.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">All products are well stocked!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {stockAlerts.map((product) => (
        <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
              <p className="text-xs text-muted-foreground">Updated {product.lastUpdated}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{product.currentStock}</span>
            </div>
            <Badge 
              variant={product.isOutOfStock ? "destructive" : "secondary"}
              className="text-xs mt-1"
            >
              {product.isOutOfStock ? "Out of Stock" : "Low Stock"}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
} 