"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Mail,
  Phone,
  ShoppingBag,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CustomerDetailsModal } from "./customer-details-modal"
import { toast } from "sonner"

interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: string
  totalOrders: number
  totalSpent: number
  lastOrder?: string
  status: string
}

interface CustomersTableProps {
  searchQuery: string
  tenantId: string
}

export function CustomersTable({ searchQuery, tenantId }: CustomersTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchCustomers = async () => {
    if (!tenantId) return
    
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        search: searchQuery,
        tenantId
      })

      const response = await fetch(`/api/admin/customers?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }

      const data = await response.json()
      setCustomers(data.customers)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      toast.error('Failed to load customers')
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (tenantId) {
      fetchCustomers()
    }
  }, [tenantId, searchQuery, currentPage])

  const handleViewDetails = async (customer: Customer) => {
    try {
      const response = await fetch(`/api/admin/customers/${customer.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch customer details')
      }

      const { customer: customerDetails } = await response.json()
      setSelectedCustomer(customerDetails)
      setIsDetailsModalOpen(true)
    } catch (error) {
      toast.error('Failed to load customer details')
      console.error('Error fetching customer details:', error)
    }
  }

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    )
  }

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== customerId))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "vip":
        return <Badge variant="default" className="bg-purple-600">VIP</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading customers...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
          <div className="col-span-3 font-medium">Customer</div>
          <div className="col-span-2 font-medium">Contact</div>
          <div className="col-span-1 font-medium">Orders</div>
          <div className="col-span-2 font-medium">Total Spent</div>
          <div className="col-span-2 font-medium">Last Order</div>
          <div className="col-span-1 font-medium">Status</div>
          <div className="col-span-1 font-medium">Actions</div>
        </div>
        
        {customers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No customers found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center">
              <div className="col-span-3 flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {customer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {customer.id.slice(-8)}</p>
                </div>
              </div>
              
              <div className="col-span-2 space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  {customer.email || 'No email'}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {customer.phone || 'No phone'}
                </div>
              </div>
              
              <div className="col-span-1">
                <div className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{customer.totalOrders}</span>
                </div>
              </div>
              
              <div className="col-span-2 font-medium">
                {formatCurrency(customer.totalSpent)}
              </div>
              
              <div className="col-span-2 text-sm text-muted-foreground">
                {customer.lastOrder ? formatDate(customer.lastOrder) : 'No orders'}
              </div>
              
              <div className="col-span-1">
                {getStatusBadge(customer.status)}
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
                    <DropdownMenuItem onClick={() => handleViewDetails(customer)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit customer
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      View orders
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete customer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false)
          setSelectedCustomer(null)
        }}
        onUpdate={handleUpdateCustomer}
        onDelete={handleDeleteCustomer}
      />
    </div>
  )
} 