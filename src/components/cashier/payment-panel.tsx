import { Button } from "@/components/ui/button"
import { CreditCard, DollarSign, CheckCircle } from "lucide-react"

export function PaymentPanel() {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="text-lg font-semibold mb-2">Payment</h3>
      <div className="flex gap-2 mb-2">
        <Button variant="outline" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Cash
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Card
        </Button>
      </div>
      <div className="flex gap-2 mb-2">
        {[10, 20, 50, 100].map((amt) => (
          <Button key={amt} variant="secondary" size="sm">${amt}</Button>
        ))}
      </div>
      <Button className="w-full flex items-center gap-2">
        <CheckCircle className="h-5 w-5" />
        Complete Sale
      </Button>
    </div>
  )
} 