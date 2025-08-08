"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
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
  TrendingDown,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useDebounce } from "@/hooks/useDebounce"
import { fetchProducts, deleteProduct, type Product } from "@/lib/api/products"
import { toast } from "sonner"
import Link from "next/link"

interface ProductsTableProps {
  searchQuery?: string
}

export function ProductsTable({ searchQuery = "" }: ProductsTableProps) {
  const { data: session, status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null)

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const { ref, isIntersecting, isLoading: isIntersectionLoading, setIsLoading: setIntersectionLoading } = useInfiniteScroll({
    threshold: 0.1,
    rootMargin: '200px',
  })

  // Reset pagination when debounced search query changes
  useEffect(() => {
    if (status === 'loading') return // Don't load if session is still loading
    
    setProducts([])
    setPage(1)
    setHasMore(true)
    loadProducts(1)
  }, [debouncedSearchQuery, status])

  // Load initial products when session is ready
  useEffect(() => {
    if (status === 'loading') return // Don't load if session is still loading
    if (status === 'unauthenticated') return // Don't load if not authenticated
    
    if (page === 1 && session?.user?.tenantId) {
      loadProducts(1)
    }
  }, [page, status, session?.user?.tenantId])

  const loadProducts = useCallback(async (pageNum: number, append: boolean = false) => {
    try {
      // Don't load if session is still loading or user is not authenticated
      if (status === 'loading' || status === 'unauthenticated') {
        return
      }
      
      
      const tenantId = session?.user?.tenantId
      const userRole = session?.user?.role
      
     
      
      if (!tenantId) {
        console.log('No tenant ID found in session - user may not be assigned to a tenant yet')
        return
      }
      
      setIsLoading(true)
      setIntersectionLoading(true)
      const response = await fetchProducts(pageNum, 5, debouncedSearchQuery, tenantId)
      
      
      if (append) {
        setProducts(prev => [...prev, ...response.products])
      } else {
        setProducts(response.products)
      }
      
      setHasMore(response.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
      setIntersectionLoading(false)
    }
  }, [status, session?.user?.tenantId, session?.user?.role, debouncedSearchQuery, setIntersectionLoading])

  const loadMoreProducts = useCallback(() => {
    if (!isLoading && !isIntersectionLoading && hasMore) {
      const nextPage = page + 1
      // console.log('Loading next page:', nextPage)
      loadProducts(nextPage, true)
    }
  }, [page, hasMore, isLoading, isIntersectionLoading, loadProducts])

  // Handle infinite scroll
  useEffect(() => {
   
    if (isIntersecting && hasMore && !isLoading && !isIntersectionLoading) {
      loadMoreProducts()
    }
  }, [isIntersecting, hasMore, isLoading, isIntersectionLoading, loadMoreProducts, products.length, page])



  const handleDeleteProduct = async (productId: string) => {
    try {
      setDeletingProduct(productId)
      await deleteProduct(productId)
      toast.success('Product deleted successfully')
      // Remove the product from the local state
      setProducts(prev => prev.filter(product => product.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete product')
    } finally {
      setDeletingProduct(null)
    }
  }

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
    <div className="space-y-4 pb-0">
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
        
       
          <>
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
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit product
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete product
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deletingProduct === product.id}
                            >
                              {deletingProduct === product.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </>
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Loading products...</span>
              </div>
            )}
            
            {/* Intersection observer target */}
            {hasMore && (
              <div ref={ref} className="h-20 flex items-center justify-center border-t border-gray-100">
               
              </div>
            )}
            
            {/* End of list indicator */}
            {!hasMore && products.length > 0 && (
              <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
                No more products to load
              </div>
            )}
          </>
      </div>
    </div>
  )
} 