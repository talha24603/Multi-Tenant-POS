import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function CashierHeader() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/sign-in" })
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Welcome, Alex (Cashier)</h2>
          <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold tracking-wide text-primary">
            SIDZ
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Shift: Morning (9:00 AM - 5:00 PM)</p>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/avatars/cashier.png" alt="Cashier" />
          <AvatarFallback>CA</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">Alex</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="ml-2"
        >
          Logout
        </Button>
      </div>
    </div>
  )
} 