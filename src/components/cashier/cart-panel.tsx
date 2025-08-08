'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Edit, Minus, Plus } from "lucide-react"
import { useCashier } from "@/context/cashier-context"
import { useState } from "react"

export function CartPanel() {
  const { state, removeFromCart, updateQuantity, getCartSubtotal, getTax, getCartTotal } = useCashier()
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState<number>(0)

  const handleEditQuantity = (id: string, currentQuantity: number) => {
    setEditingItem(id)
    setEditQuantity(currentQuantity)
  }

  const handleSaveQuantity = (id: string) => {
    if (editQuantity > 0) {
      updateQuantity(id, editQuantity)
    }
    setEditingItem(null)
    setEditQuantity(0)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditQuantity(0)
  }

  const handleQuantityChange = (id: string, change: number) => {
    const item = state.cart.find(item => item.id === id)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change)
      updateQuantity(id, newQuantity)
    }
  }

  const subtotal = getCartSubtotal()
  const tax = getTax()
  const total = getCartTotal()

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="text-lg font-semibold mb-2">Current Sale</h3>
      
      {state.cart.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No items in cart</p>
          <p className="text-sm">Search for products to add them to the cart</p>
        </div>
      ) : (
        <>
          <div className="divide-y max-h-96 overflow-y-auto">
            {state.cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </div>
                  {item.stock < item.quantity && (
                    <div className="text-xs text-red-600">
                      Warning: Insufficient stock ({item.stock} available)
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    {editingItem === item.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(Number(e.target.value))}
                          className="w-12 h-6 text-xs"
                          min="1"
                          max={item.stock}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-green-600"
                          onClick={() => handleSaveQuantity(item.id)}
                        >
                          ✓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-600"
                          onClick={handleCancelEdit}
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleEditQuantity(item.id, item.quantity)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleQuantityChange(item.id, 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-red-600"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (7%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 