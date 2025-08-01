"use client"

import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import { useEffect, useState } from "react"

interface SalesData {
  name: string
  total: number
}

export function SalesChart() {
  const [data, setData] = useState<SalesData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSalesData()
  }, [])

  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/sales-chart')
      if (response.ok) {
        const result = await response.json()
        setData(result.salesData)
      } else {
        console.error('Failed to fetch sales chart data')
        // Fallback to empty data
        setData([])
      }
    } catch (error) {
      console.error('Error fetching sales chart data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">Loading sales data...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="text-muted-foreground">No sales data available</div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']}
          labelFormatter={(label) => `${label} Sales`}
        />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 