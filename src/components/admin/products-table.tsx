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
  Package,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const products = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    category: "Electronics",
    price: 999.99,
    stock: 45,
    imageUrl: "/products/iphone.jpg",
    status: "in-stock",
    sales: 234,
    trend: "up",
  },
  {
    id: "2",
    name: "MacBook Air M2",
    category: "Electronics",
    price: 1199.99,
    stock: 12,
    imageUrl: "/products/macbook.jpg",
    status: "low-stock",
    sales: 156,
    trend: "up",
  },
  {
    id: "3",
    name: "AirPods Pro",
    category: "Audio",
    price: 249.99,
    stock: 0,
    imageUrl: "/products/airpods.jpg",
    status: "out-of-stock",
    sales: 98,
    trend: "down",
  },
  {
    id: "4",
    name: "iPad Air",
    category: "Tablets",
    price: 599.99,
    stock: 23,
    imageUrl: "/products/ipad.jpg",
    status: "in-stock",
    sales: 87,
    trend: "up",
  },
  {
    id: "5",
    name: "Apple Watch Series 9",
    category: "Wearables",
    price: 399.99,
    stock: 8,
    imageUrl: "/products/watch.jpg",
    status: "low-stock",
    sales: 76,
    trend: "up",
  },
]

export function ProductsTable() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge variant="default">In Stock</Badge>
      case "low-stock":
        return <Badge variant="secondary">Low Stock</Badge>
      case "out-of-stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b">
          <div className="col-span-4 font-medium">Product</div>
          <div className="col-span-2 font-medium">Category</div>
          <div className="col-span-1 font-medium">Price</div>
          <div className="col-span-1 font-medium">Stock</div>
          <div className="col-span-1 font-medium">Sales</div>
          <div className="col-span-1 font-medium">Status</div>
          <div className="col-span-2 font-medium">Actions</div>
        </div>
        
        {products.map((product) => (
          <div key={product.id} className="grid grid-cols-12 gap-4 p-4 border-b last:border-b-0 items-center">
            <div className="col-span-4 flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={product.imageUrl} alt={product.name} />
                <AvatarFallback>
                  <Package className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">ID: {product.id}</p>
              </div>
            </div>
            
            <div className="col-span-2">
              <Badge variant="outline">{product.category}</Badge>
            </div>
            
            <div className="col-span-1 font-medium">
              ${product.price.toFixed(2)}
            </div>
            
            <div className="col-span-1">
              <span className="font-medium">{product.stock}</span>
            </div>
            
            <div className="col-span-1 flex items-center gap-1">
              <span className="font-medium">{product.sales}</span>
              {getTrendIcon(product.trend)}
            </div>
            
            <div className="col-span-1">
              {getStatusBadge(product.status)}
            </div>
            
            <div className="col-span-2">
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
                    Edit product
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete product
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