"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Shield, UserCheck, Search, Filter, TrendingUp } from "lucide-react"
import { UsersTable } from "@/components/admin/users-table"
import Link from "next/link"

interface UserStats {
  totalUsers: number
  activeUsers: number
  adminUsers: number
  newUsersThisMonth: number
  roleStats: Record<string, number>
}

export default function UsersPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/admin/users/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch user statistics")
        }
        const data = await response.json()
        setStats(data.stats)
      } catch (err) {
        setError("Failed to load user statistics")
        console.error("Error fetching user stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <div className="flex items-center space-x-2">
          <Link href="/admin/create-employee">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.totalUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all tenants
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {loading ? "..." : stats?.activeUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently verified
            </p>
          </CardContent>
        </Card>
        
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading ? "..." : stats?.adminUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Administrative users
            </p>
          </CardContent>
        </Card> */}
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {loading ? "..." : stats?.newUsersThisMonth || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              New user registrations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          {/* <CardDescription>
            Manage system users and their permissions across tenants
          </CardDescription> */}
          {/* <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search users..."
                className="pl-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div> */}
        </CardHeader>
        <CardContent>
          <UsersTable />
        </CardContent>
      </Card>
    </div>
  )
} 