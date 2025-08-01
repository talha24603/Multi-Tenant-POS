"use client"

import { useState } from "react"
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
  ShoppingBag
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const customers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    totalOrders: 15,
    totalSpent: 2345.67,
    lastOrder: "2024-01-15",
    status: "active",
    avatar: "/avatars/01.png",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 234-5678",
    totalOrders: 8,
    totalSpent: 1234.56,
    lastOrder: "2024-01-10",
    status: "active",
    avatar: "/avatars/02.png",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    phone: "+1 (555) 345-6789",
    totalOrders: 3,
    totalSpent: 567.89,
    lastOrder: "2024-01-05",
    status: "inactive",
    avatar: "/avatars/03.png",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@example.com",
    phone: "+1 (555) 456-7890",
    totalOrders: 22,
    totalSpent: 3456.78,
    lastOrder: "2024-01-12",
    status: "vip",
    avatar: "/avatars/04.png",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie.wilson@example.com",
    phone: "+1 (555) 567-8901",
    totalOrders: 6,
    totalSpent: 890.12,
    lastOrder: "2024-01-08",
    status: "active",
    avatar: "/avatars/05.png",
  },
]

export function CustomersTable() {
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)

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
        
        {customers.map((customer) => (
          <div key={customer.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center">
            <div className="col-span-3 flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback>
                  {customer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
              </div>
            </div>
            
            <div className="col-span-2 space-y-1">
              <div className="flex items-center gap-1 text-sm">
                <Mail className="h-3 w-3 text-muted-foreground" />
                {customer.email}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />
                {customer.phone}
              </div>
            </div>
            
            <div className="col-span-1">
              <div className="flex items-center gap-1">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{customer.totalOrders}</span>
              </div>
            </div>
            
            <div className="col-span-2 font-medium">
              ${customer.totalSpent.toFixed(2)}
            </div>
            
            <div className="col-span-2 text-sm text-muted-foreground">
              {formatDate(customer.lastOrder)}
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
                  <DropdownMenuItem>
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
        ))}
      </div>
    </div>
  )
} 