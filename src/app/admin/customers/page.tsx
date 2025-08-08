"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, Users, TrendingUp, Loader2 } from "lucide-react"
import { CustomersTable } from "@/components/admin/customers-table"
import { AddCustomerModal } from "@/components/admin/add-customer-modal"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface CustomerStats {
  totalCustomers: number
  newThisMonth: number
  activeCustomers: number
  averageOrderValue: number
  growthPercentage: number
}

export default function CustomersPage() {
  const session = useSession()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [stats, setStats] = useState<CustomerStats>({
    totalCustomers: 0,
    newThisMonth: 0,
    activeCustomers: 0,
    averageOrderValue: 0,
    growthPercentage: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [tenantId, setTenantId] = useState<string>("")

  useEffect(() => {
    if (session.data?.user?.tenantId) {
      setTenantId(session.data.user.tenantId)
    }
    console.log(session.data?.user?.tenantId)
  }, [session.data?.user?.tenantId])

  const fetchStats = async () => {
    if (!tenantId) return

    setIsLoadingStats(true)
    try {
      const response = await fetch(`/api/admin/customers/stats?tenantId=${tenantId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch customer stats')
      }

      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching customer stats:', error)
      toast.error('Failed to load customer statistics')
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    if (tenantId) {
      fetchStats()
    }
  }, [tenantId])

  const handleCustomerAdded = (newCustomer: any) => {
    // Refresh the table and stats
    fetchStats()
    // You could also trigger a table refresh here
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  {stats.growthPercentage > 0 ? '+' : ''}{stats.growthPercentage}% from last month
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold text-green-600">{stats.newThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  New customer registrations
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold text-blue-600">{stats.activeCustomers}</div>
                <p className="text-xs text-muted-foreground">
                  Customers with recent activity
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
                <p className="text-xs text-muted-foreground">
                  Average customer spend
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>
            Manage your customer information and track their activity
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <CustomersTable searchQuery={searchQuery} tenantId={tenantId} />
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCustomerAdded={handleCustomerAdded}
        tenantId={tenantId}
      />
    </div>
  )
} 