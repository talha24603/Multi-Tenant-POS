"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

interface RecentSale {
  id: string
  customer: string
  email: string
  amount: string
  status: string
  createdAt: string
  paymentType: string
  items: number
}

export function RecentSales() {
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentSales()
  }, [])

  const fetchRecentSales = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/recent-sales')
      if (response.ok) {
        const data = await response.json()
        setRecentSales(data.recentSales)
      } else {
        console.error('Failed to fetch recent sales')
        setRecentSales([])
      }
    } catch (error) {
      console.error('Error fetching recent sales:', error)
      setRecentSales([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center animate-pulse">
            <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
            <div className="ml-4 space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  if (recentSales.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent sales found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>
              {sale.customer.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer}</p>
            <p className="text-sm text-muted-foreground">{sale.email}</p>
            <p className="text-xs text-muted-foreground">
              {sale.paymentType} • {sale.items} items
            </p>
          </div>
          <div className="ml-auto font-medium flex items-center gap-2">
            <span>{sale.amount}</span>
            {/* <Badge variant={sale.status === "completed" ? "default" : "secondary"}>
              {sale.status}
            </Badge> */}
          </div>
        </div>
      ))}
    </div>
  )
} 