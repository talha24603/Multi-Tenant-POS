"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProductsTable } from "@/components/admin/products-table"
import { fetchProductStats, type ProductStats } from "@/lib/api/products"

export default function ProductsPage() {
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  // Fetch product statistics
  useEffect(() => {
    const loadStats = async () => {
      if (status === 'loading' || status === 'unauthenticated') return
      
      const tenantId = session?.user?.tenantId
      if (!tenantId) return

      try {
        setIsLoadingStats(true)
        console.log('Fetching stats for tenant:', tenantId)
        const statsData = await fetchProductStats(tenantId)
        console.log('Stats data received:', statsData)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading product stats:', error)
        console.error('Error details:', error)
      } finally {
        setIsLoadingStats(false)
      }
    }

    loadStats()
  }, [status, session?.user?.tenantId])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 pb-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Link href="/admin/products/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.percentageChange || '+0.0% from last month'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-red-600">{stats?.lowStockCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Products need restocking
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-orange-600">{stats?.outOfStockCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Products unavailable
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{stats?.categoriesCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Product categories
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card className="mb-0">
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product catalog and inventory levels
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            {/* <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button> */}
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <ProductsTable searchQuery={searchQuery} />
        </CardContent>
      </Card>
    </div>
  )
} 