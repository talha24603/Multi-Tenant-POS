"use client"

import { Bar, BarChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { name: "Mon", sales: 4000, revenue: 2400, customers: 2400 },
  { name: "Tue", sales: 3000, revenue: 1398, customers: 2210 },
  { name: "Wed", sales: 2000, revenue: 9800, customers: 2290 },
  { name: "Thu", sales: 2780, revenue: 3908, customers: 2000 },
  { name: "Fri", sales: 1890, revenue: 4800, customers: 2181 },
  { name: "Sat", sales: 2390, revenue: 3800, customers: 2500 },
  { name: "Sun", sales: 3490, revenue: 4300, customers: 2100 },
]

export function AnalyticsChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
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
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" name="Sales" />
        <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
        <Bar dataKey="customers" fill="#ffc658" name="Customers" />
      </BarChart>
    </ResponsiveContainer>
  )
} 