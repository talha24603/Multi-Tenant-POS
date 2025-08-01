"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MoreHorizontal, 
  Eye, 
  Receipt,
  CreditCard,
  CreditCardIcon,
  User
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const sales = [
  {
    id: "SALE-001",
    customer: "John Doe",
    customerEmail: "john.doe@example.com",
    items: 3,
    total: 299.99,
    paymentType: "Credit Card",
    status: "completed",
    date: "2024-01-15T10:30:00Z",
    cashier: "Alice Johnson",
  },
  {
    id: "SALE-002",
    customer: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    items: 1,
    total: 99.99,
    paymentType: "Cash",
    status: "completed",
    date: "2024-01-15T11:15:00Z",
    cashier: "Bob Wilson",
  },
  {
    id: "SALE-003",
    customer: "Bob Johnson",
    customerEmail: "bob.johnson@example.com",
    items: 2,
    total: 149.98,
    paymentType: "Credit Card",
    status: "pending",
    date: "2024-01-15T12:00:00Z",
    cashier: "Alice Johnson",
  },
  {
    id: "SALE-004",
    customer: "Alice Brown",
    customerEmail: "alice.brown@example.com",
    items: 5,
    total: 599.95,
    paymentType: "Credit Card",
    status: "completed",
    date: "2024-01-15T13:45:00Z",
    cashier: "Charlie Davis",
  },
  {
    id: "SALE-005",
    customer: "Charlie Wilson",
    customerEmail: "charlie.wilson@example.com",
    items: 1,
    total: 79.99,
    paymentType: "Cash",
    status: "completed",
    date: "2024-01-15T14:20:00Z",
    cashier: "Bob Wilson",
  },
]

export function SalesTable() {
  const [selectedSale, setSelectedSale] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getPaymentIcon = (paymentType: string) => {
    return paymentType === "Credit Card" ? (
      <CreditCard className="h-4 w-4" />
    ) : (
      <CreditCardIcon className="h-4 w-4" />
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
          <div className="col-span-2 font-medium">Sale ID</div>
          <div className="col-span-2 font-medium">Customer</div>
          <div className="col-span-1 font-medium">Items</div>
          <div className="col-span-2 font-medium">Total</div>
          <div className="col-span-2 font-medium">Payment</div>
          <div className="col-span-1 font-medium">Status</div>
          <div className="col-span-1 font-medium">Date</div>
          <div className="col-span-1 font-medium">Actions</div>
        </div>
        
        {sales.map((sale) => (
          <div key={sale.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center">
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{sale.id}</span>
              </div>
            </div>
            
            <div className="col-span-2 flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/avatars/${sale.customer.toLowerCase().replace(' ', '-')}.png`} alt={sale.customer} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{sale.customer}</p>
                <p className="text-xs text-muted-foreground">{sale.customerEmail}</p>
              </div>
            </div>
            
            <div className="col-span-1">
              <span className="font-medium">{sale.items}</span>
            </div>
            
            <div className="col-span-2 font-medium">
              ${sale.total.toFixed(2)}
            </div>
            
            <div className="col-span-2 flex items-center gap-2">
              {getPaymentIcon(sale.paymentType)}
              <span className="text-sm">{sale.paymentType}</span>
            </div>
            
            <div className="col-span-1">
              {getStatusBadge(sale.status)}
            </div>
            
            <div className="col-span-1 text-sm text-muted-foreground">
              {formatDate(sale.date)}
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
                    <Receipt className="mr-2 h-4 w-4" />
                    Print receipt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Cancel sale
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