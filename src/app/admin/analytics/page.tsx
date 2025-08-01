"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Filter
} from "lucide-react"
import { SalesChart } from "@/components/admin/sales-chart"
import { AnalyticsChart } from "@/components/admin/analytics-chart"

interface AnalyticsStats {
  totalRevenue: {
    current: number
    change: number
  }
  totalSales: {
    current: number
    change: number
  }
  newCustomers: {
    current: number
    change: number
  }
  productsSold: {
    current: number
    change: number
  }
  topTenants: Array<{
    tenantId: string
    tenantName: string
    _sum: {
      total: number
    }
  }>
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/analytics/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch analytics statistics")
        }
        const data = await response.json()
        setStats(data.stats)
      } catch (err) {
        setError("Failed to load analytics statistics")
        console.error("Error fetching analytics stats:", err)
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
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Last 30 Days
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Filter className="h-3 w-3" />
            All Tenants
          </Badge>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatCurrency(stats?.totalRevenue.current || 0)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats?.totalRevenue.change !== undefined && (
                <>
                  {stats.totalRevenue.change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  {formatPercentage(stats.totalRevenue.change)} from last month
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `+${stats?.totalSales.current || 0}`}
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
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `+${stats?.newCustomers.current || 0}`}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats?.newCustomers.change !== undefined && (
                <>
                  {stats.newCustomers.change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  {formatPercentage(stats.newCustomers.change)} from last month
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `+${stats?.productsSold.current || 0}`}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats?.productsSold.change !== undefined && (
                <>
                  {stats.productsSold.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  {formatPercentage(stats.productsSold.change)} from last month
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Revenue performance over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Performing Tenants</CardTitle>
                <CardDescription>
                  Revenue by tenant organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center text-muted-foreground py-4">
                      Loading tenant data...
                    </div>
                  ) : stats?.topTenants && stats.topTenants.length > 0 ? (
                    stats.topTenants.map((tenant, index) => {
                      const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-red-600']
                      return (
                        <div key={tenant.tenantId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 ${colors[index % colors.length]} rounded-full`}></div>
                            <span className="text-sm">{tenant.tenantName}</span>
                    </div>
                          <span className="text-sm font-medium">
                            {formatCurrency(tenant._sum.total)}
                          </span>
                  </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No tenant data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>
                Detailed sales performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Analytics</CardTitle>
              <CardDescription>
                Customer behavior and demographics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Customer analytics content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
              <CardDescription>
                Product performance and inventory insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Product analytics content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 