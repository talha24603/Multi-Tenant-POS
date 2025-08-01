"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  LogOut
} from "lucide-react"
import { SalesChart } from "@/components/admin/sales-chart"
import { RecentSales } from "@/components/admin/recent-sales"
import { TopProducts } from "@/components/admin/top-products"
import { StockAlerts } from "@/components/admin/stock-alerts"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useState } from "react"

interface DashboardStats {
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
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/analytics/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        console.log(data.stats);
      } else {
        console.error('Failed to fetch dashboard stats')
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/sign-in" 
      })
      toast.success("Logged out successfully")
      router.push("/sign-in")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Error logging out")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (change: number) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(1)}%`
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">Tenant: Main Store</Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut onClick={() => signOut({ callbackUrl: "/" })} className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : formatCurrency(stats?.totalRevenue.current || 0)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats?.totalRevenue.change !== undefined && (
                <>
                  {stats.totalRevenue.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  {formatPercentage(stats.totalRevenue.change)} from last month
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "Loading..." : `+${stats?.totalSales.current || 0}`}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats?.totalSales.change !== undefined && (
                <>
                  {stats.totalSales.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  {formatPercentage(stats.totalSales.change)} from last month
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
              {loading ? "Loading..." : `+${stats?.productsSold.current || 0}`}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats?.productsSold.change !== undefined && (
                <>
                  {stats.productsSold.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  {formatPercentage(stats.productsSold.change)} from last month
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
              {loading ? "Loading..." : `+${stats?.newCustomers.current || 0}`}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats?.newCustomers.change !== undefined && (
                <>
                  {stats.newCustomers.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  {formatPercentage(stats.newCustomers.change)} from last month
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Sales performance over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <SalesChart />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  Latest transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>
                  Best selling products this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopProducts />
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Stock Alerts</CardTitle>
                <CardDescription>
                  Products running low on stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StockAlerts />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Detailed analytics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>
                Generate and view reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reports content coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}