"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Store, 
  Users, 
  Calendar,
  Mail,
  Phone,
  Globe,
  MapPin
} from "lucide-react"

interface TenantDetailsModalProps {
  tenantId: string | null
  isOpen: boolean
  onClose: () => void
}

interface TenantDetails {
  id: string
  name: string
  status: string
  email: string
  phone: string
  address: string
  website: string
  description: string
  logo: string
  createdAt: string
  subscriptionStatus: string
  subscriptionPlan: string
  subscriptionEndDate: string
  users: Array<{
    user: {
      id: string
      name: string
      email: string
      createdAt: string
    }
    role: string
  }>
}

export function TenantDetailsModal({ tenantId, isOpen, onClose }: TenantDetailsModalProps) {
  const [tenant, setTenant] = useState<TenantDetails | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tenantId && isOpen) {
      fetchTenantDetails()
    }
  }, [tenantId, isOpen])

  const fetchTenantDetails = async () => {
    if (!tenantId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}`)
      if (response.ok) {
        const data = await response.json()
        setTenant(data)
      } else {
        console.error("Failed to fetch tenant details")
      }
    } catch (error) {
      console.error("Error fetching tenant details:", error)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Tenant Details</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading tenant details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            {tenant?.name}
          </DialogTitle>
          <DialogDescription>
            Detailed information about this tenant
          </DialogDescription>
        </DialogHeader>

        {tenant && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(tenant.status)}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Created:</span>
                  <span>{formatDate(tenant.createdAt)}</span>
                </div>
                {tenant.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                    <span>{tenant.email}</span>
                  </div>
                )}
                {tenant.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Phone:</span>
                    <span>{tenant.phone}</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {tenant.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Address:</span>
                    <span>{tenant.address}</span>
                  </div>
                )}
                {tenant.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Website:</span>
                    <a href={tenant.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {tenant.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-medium">Subscription:</span>
                  <Badge variant="outline">{tenant.subscriptionStatus || "N/A"}</Badge>
                </div>
                {tenant.subscriptionPlan && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Plan:</span>
                    <span>{tenant.subscriptionPlan}</span>
                  </div>
                )}
              </div>
            </div>

            {tenant.description && (
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{tenant.description}</p>
              </div>
            )}

            {/* Users */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users ({tenant.users.length})
              </h3>
              <div className="space-y-2">
                {tenant.users.map((user) => (
                  <div key={user.user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.user.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{user.role}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(user.user.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 