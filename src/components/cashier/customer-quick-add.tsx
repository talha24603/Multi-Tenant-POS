import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export function CustomerQuickAdd() {
  return (
    <Button variant="secondary" className="flex items-center gap-2">
      <UserPlus className="h-4 w-4" />
      Add Customer
    </Button>
  )
} 