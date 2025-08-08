'use client'

import { Button } from "@/components/ui/button"
import { UserPlus, User } from "lucide-react"
import { useCashier } from "@/context/cashier-context"

export function CustomerQuickAdd() {
  const { state, setCustomer } = useCashier()

  const handleQuickAdd = () => {
    // This could open a quick customer creation modal
    // For now, we'll just clear the selected customer
    setCustomer(null)
  }

  return (
    <div className="flex items-center gap-2">
      {state.selectedCustomer ? (
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-green-600" />
          <span className="text-green-600 font-medium">{state.selectedCustomer.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setCustomer(null)}
          >
            ✕
          </Button>
        </div>
      ) : (
        <Button variant="secondary" className="flex items-center gap-2" onClick={handleQuickAdd}>
          <UserPlus className="h-4 w-4" />
          Add Customer
        </Button>
      )}
    </div>
  )
} 