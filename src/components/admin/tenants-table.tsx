"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MoreHorizontal, 
  Trash2, 
  Eye,
  Store,
  Power,
  PowerOff,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TenantDetailsModal } from "./tenant-details-modal"
import { toast } from "sonner"

interface Tenant {
  id: string
  name: string
  status: string
  email: string
  type: string
  phone: string
  address: string
  website: string
  description: string
  logo: string
  createdAt: string
  subscriptionStatus: string
  subscriptionPlan: string
  subscriptionEndDate: string
  _count: {
    users: number
    products: number
    Customer: number
    Sale: number
  }
}

export function TenantsTable() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchTenants()
  }, [])

  const fetchTenants = async () => {
    try {
      const response = await fetch("/api/admin/tenants")
      if (response.ok) {
        const data = await response.json()
        setTenants(data)
      } else {
        toast.error("Failed to fetch tenants")
      }
    } catch (error) {
      console.error("Error fetching tenants:", error)
      toast.error("Failed to fetch tenants")
    } finally {
      setLoading(false)
    }
  }

  const updateTenantStatus = async (tenantId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/tenants", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenantId, status: newStatus }),
      })

      if (response.ok) {
        const updatedTenant = await response.json()
        setTenants(prev => 
          prev.map(tenant => 
            tenant.id === tenantId ? updatedTenant : tenant
          )
        )
        toast.success(`Tenant ${newStatus === "ACTIVE" ? "activated" : "deactivated"} successfully`)
      } else {
        toast.error("Failed to update tenant status")
      }
    } catch (error) {
      console.error("Error updating tenant status:", error)
      toast.error("Failed to update tenant status")
    }
  }

  const deleteTenant = async (tenantId: string, tenantName: string) => {
    if (!confirm(`Are you sure you want to delete "${tenantName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/tenants?tenantId=${tenantId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTenants(prev => prev.filter(tenant => tenant.id !== tenantId))
        toast.success("Tenant deleted successfully")
      } else {
        toast.error("Failed to delete tenant")
      }
    } catch (error) {
      console.error("Error deleting tenant:", error)
      toast.error("Failed to delete tenant")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default">Active</Badge>
      case "INACTIVE":
        return <Badge variant="secondary">Inactive</Badge>
      case "SUSPENDED":
        return <Badge variant="destructive">Suspended</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatType = (type: string) => {
    switch (type) {
      case "tenant":
        return "Tenant"
      case "superAdmin":
        return "Super Admin"
      default:
        return type || "Tenant"
    }
  }

  const handleViewDetails = (tenantId: string) => {
    setSelectedTenant(tenantId)
    setShowDetailsModal(true)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="grid grid-cols-8 gap-4 p-4 bg-muted/50 border-b">
            <div className="col-span-2 font-medium">Tenant</div>
            <div className="col-span-1 font-medium">Users</div>
            <div className="col-span-1 font-medium">Type</div>
            <div className="col-span-1 font-medium">Status</div>
            <div className="col-span-1 font-medium">Created</div>
            <div className="col-span-1 font-medium">Actions</div>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading tenants...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-8 gap-4 p-4 bg-muted/50 border-b">
          <div className="col-span-2 font-medium">Tenant</div>
          <div className="col-span-1 font-medium">Users</div>
          <div className="col-span-1 font-medium">Type</div>
          <div className="col-span-1 font-medium">Status</div>
          <div className="col-span-1 font-medium">Created</div>
          <div className="col-span-1 font-medium">Actions</div>
        </div>
        
        {tenants.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tenants found</p>
          </div>
        ) : (
          tenants.map((tenant) => (
            <div key={tenant.id} className="grid grid-cols-8 gap-4 p-4 border-b last:border-b-0 items-center">
              <div className="col-span-2 flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={tenant.logo || `/tenants/${tenant.id}.png`} alt={tenant.name} />
                  <AvatarFallback>
                    <Store className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium">{tenant.name}</p>
                  {/* <p className="text-sm text-muted-foreground">ID: {tenant.id}</p> */}
                </div>
              </div>
              
              <div className="col-span-1 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{tenant._count.users}</span>
              </div>
              
              <div className="col-span-1">
                <Badge variant="outline">{formatType(tenant.type)}</Badge>
              </div>
              
              <div className="col-span-1">
                {getStatusBadge(tenant.status)}
              </div>
              
              <div className="col-span-1 text-sm text-muted-foreground">
                {formatDate(tenant.createdAt)}
              </div>
              
              <div className="col-span-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleViewDetails(tenant.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {tenant.status === "ACTIVE" ? (
                      <DropdownMenuItem 
                        onClick={() => updateTenantStatus(tenant.id, "INACTIVE")}
                        className="text-orange-600"
                      >
                        <PowerOff className="mr-2 h-4 w-4" />
                        Deactivate
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem 
                        onClick={() => updateTenantStatus(tenant.id, "ACTIVE")}
                        className="text-green-600"
                      >
                        <Power className="mr-2 h-4 w-4" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => deleteTenant(tenant.id, tenant.name)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete tenant
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      <TenantDetailsModal
        tenantId={selectedTenant}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedTenant(null)
        }}
      />
    </div>
  )
} 