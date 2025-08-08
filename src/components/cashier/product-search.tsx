'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Barcode, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useCashier } from "@/context/cashier-context"
import { searchProducts, Product } from "@/lib/api/cashier"
import { useDebounce } from "@/hooks/useDebounce"

export function ProductSearch() {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const { addToCart, state } = useCashier()

  useEffect(() => {
    if (debouncedQuery.length > 0 && state.tenantId) {
      setIsLoading(true)
      searchProducts(debouncedQuery, state.tenantId)
        .then((results) => {
          setProducts(results)
          setShowResults(true)
        })
        .catch((error) => {
          console.error('Error searching products:', error)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setProducts([])
      setShowResults(false)
    }
  }, [debouncedQuery, state.tenantId])

  const handleProductSelect = (product: Product) => {
    const cartItem = {
      id: `${product.id}-${Date.now()}`, // Unique ID for cart item
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
      barcode: product.barcode,
      category: product.category,
      imageUrl: product.imageUrl
    }
    
    addToCart(cartItem)
    setQuery("")
    setShowResults(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && products.length > 0) {
      handleProductSelect(products[0])
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input 
            placeholder="Search or scan product..." 
            className="flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowResults(true)}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button variant="outline" size="icon" title="Scan Barcode">
          <Barcode className="h-5 w-5" />
        </Button>
        <Button variant="default" size="icon" title="Search">
          <Search className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Search Results Dropdown */}
      {showResults && products.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleProductSelect(product)}
            >
              <div className="flex-1">
                <div className="font-medium text-sm">{product.name}</div>
                <div className="text-xs text-muted-foreground">
                  {product.category} • Stock: {product.stock}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">${product.price.toFixed(2)}</div>
                {product.barcode && (
                  <div className="text-xs text-muted-foreground">{product.barcode}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No Results */}
      {showResults && query.length > 0 && products.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 p-3">
          <div className="text-sm text-muted-foreground">No products found</div>
        </div>
      )}
    </div>
  )
} 