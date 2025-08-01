import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function CashierHeader() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold">Welcome, Alex (Cashier)</h2>
        <p className="text-sm text-muted-foreground">Shift: Morning (9:00 AM - 5:00 PM)</p>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/avatars/cashier.png" alt="Cashier" />
          <AvatarFallback>CA</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">Alex</span>
      </div>
    </div>
  )
} 