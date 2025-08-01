"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  CreditCard, 
  CreditCardIcon,
  Calendar, 
  Filter 
} from "lucide-react"
import { SalesTable } from "@/components/admin/sales-table"
import { SalesChart } from "@/components/admin/sales-chart"

interface SalesStats {
  totalSales: {
    current: number
    change: number
  }
  transactions: {
    current: number
    change: number
  }
  cardPayments: {
    amount: number
    percentage: number
  }
  cashPayments: {
    amount: number
    percentage: number
  }
  paymentMethods: Array<{
    paymentType: string
    _sum: {
      total: number
    }
  }>
}

export default function SalesPage() {
  const [stats, setStats] = useState<SalesStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/sales/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch sales statistics")
        }
        const data = await response.json()
        setStats(data.stats)
      } catch (err) {
        setError("Failed to load sales statistics")
        console.error("Error fetching sales stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(1)}%`
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sales</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatCurrency(stats?.totalSales.current || 0)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats?.totalSales.change !== undefined && (
                <>
                  {stats.totalSales.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  {formatPercentage(stats.totalSales.change)} from last month
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `+${stats?.transactions.current || 0}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.transactions.change !== undefined && (
                `${formatPercentage(stats.transactions.change)} from last month`
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Card Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? "..." : formatCurrency(stats?.cardPayments.amount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.cardPayments.percentage !== undefined && (
                `${stats.cardPayments.percentage.toFixed(1)}% of total sales`
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Payments</CardTitle>
            <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : formatCurrency(stats?.cashPayments.amount || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.cashPayments.percentage !== undefined && (
                `${stats.cashPayments.percentage.toFixed(1)}% of total sales`
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Sales performance over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Breakdown by payment type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center text-muted-foreground py-4">
                      Loading payment data...
                    </div>
                  ) : stats?.paymentMethods && stats.paymentMethods.length > 0 ? (
                    stats.paymentMethods.map((method, index) => {
                      const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600']
                      const percentage = stats.totalSales.current > 0 ? 
                        (method._sum.total / stats.totalSales.current) * 100 : 0
                      return (
                        <div key={method.paymentType} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 ${colors[index % colors.length]} rounded-full`}></div>
                            <span className="text-sm">{method.paymentType}</span>
                          </div>
                          <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No payment data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                View and manage all sales transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 