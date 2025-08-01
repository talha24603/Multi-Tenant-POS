import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"

const cartItems = [
  { id: "1", name: "iPhone 15 Pro", price: 999.99, quantity: 1 },
  { id: "2", name: "MacBook Air M2", price: 1199.99, quantity: 2 },
]

export function CartPanel() {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.07
  const total = subtotal + tax

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="text-lg font-semibold mb-2">Current Sale</h3>
      <div className="divide-y">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-muted-foreground">${item.price.toFixed(2)} x {item.quantity}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-600">
                <Trash2 className="h-4 w-4" />
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
    </div>
  )
} 