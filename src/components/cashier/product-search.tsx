'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Barcode, Loader2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useCashier } from "@/context/cashier-context"
import { searchProducts, Product, getProductByBarcode } from "@/lib/api/cashier"
import { useDebounce } from "@/hooks/useDebounce"

export function ProductSearch() {
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const { addToCart, state } = useCashier()
  const scanTimerRef = useRef<number | null>(null)
  const [inputStartTs, setInputStartTs] = useState<number | null>(null)
  const [lastInputTs, setLastInputTs] = useState<number>(0)

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

  // Detect fast barcode scans and auto-add without requiring Enter
  useEffect(() => {
    if (!state.tenantId) return
    if (!query) {
      setInputStartTs(null)
      setLastInputTs(0)
      return
    }

    // schedule a short timeout; if no new input within this window, evaluate as a potential scan
    if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current)
    scanTimerRef.current = window.setTimeout(async () => {
      const trimmed = query.trim()
      if (!trimmed) return
      const durationMs = inputStartTs ? (lastInputTs - inputStartTs) : Number.MAX_SAFE_INTEGER
      const looksLikeBarcode = trimmed.length >= 6 && !/\s/.test(trimmed)
      const veryFastEntry = durationMs <= 120 // likely a scanner

      if (looksLikeBarcode && veryFastEntry) {
        try {
          const byBarcode = await getProductByBarcode(trimmed, state.tenantId!)
          if (byBarcode) {
            // add and reset UI
            const cartItem = {
              id: `${byBarcode.id}-${Date.now()}`,
              productId: byBarcode.id,
              name: byBarcode.name,
              price: byBarcode.price,
              quantity: 1,
              stock: byBarcode.stock,
              barcode: byBarcode.barcode,
              category: byBarcode.category,
              imageUrl: byBarcode.imageUrl,
            }
            addToCart(cartItem)
            setQuery("")
            setShowResults(false)
            setProducts([])
            setInputStartTs(null)
            setLastInputTs(0)
          }
        } catch (err) {
          console.error('Barcode auto-add failed:', err)
        }
      }
    }, 140)

    return () => {
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current)
    }
  }, [query, state.tenantId, inputStartTs, lastInputTs, addToCart])

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

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = query.trim()
      if (!trimmed || !state.tenantId) return
      try {
        // Try exact barcode match first for scanner input
        const byBarcode = await getProductByBarcode(trimmed, state.tenantId)
        if (byBarcode) {
          handleProductSelect(byBarcode)
          return
        }
        // Fallback: add first search result if present
        if (products.length > 0) {
          handleProductSelect(products[0])
        }
      } catch (err) {
        console.error('Barcode lookup failed:', err)
      }
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
            onChange={(e) => {
              const val = e.target.value
              const now = Date.now()
              // mark start of a new burst when field was empty before
              if (!query && val) {
                setInputStartTs(now)
              }
              setLastInputTs(now)
              setQuery(val)
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowResults(true)}
          />
          {/* Loader moved into the Search button to ensure right-side placement */}
        </div>
        {/* <Button variant="outline" size="icon" title="Scan Barcode">
          <Barcode className="h-5 w-5" />
        </Button> */}
        <Button variant="default" size="icon" title="Search" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
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