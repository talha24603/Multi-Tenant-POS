'use client'

import { CashierHeader } from "@/components/cashier/header"
import { CartPanel } from "@/components/cashier/cart-panel"
import { ProductSearch } from "@/components/cashier/product-search"
import { CustomerQuickAdd } from "@/components/cashier/customer-quick-add"
import { PaymentPanel } from "@/components/cashier/payment-panel"
import { CashierProvider } from "@/context/cashier-context"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useCashier } from "@/context/cashier-context"

function CashierDashboardContent() {
  const { data: session } = useSession()
  const { setTenantId, state } = useCashier()

  useEffect(() => {
    if (session?.user?.tenantId && !state.tenantId) {
      setTenantId(session.user.tenantId)
    }
  }, [session?.user?.tenantId, state.tenantId])

  if (!session?.user?.tenantId) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tenant associated with your account.</p>
          <p className="text-sm text-muted-foreground">Please contact your administrator.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <CashierHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 mb-2">
            <ProductSearch />
            <CustomerQuickAdd />
          </div>
          <CartPanel />
        </div>
        <div className="mt-12 space-y-4">
          <PaymentPanel />
          {/* <RecentSales /> */}
        </div>
      </div>
    </div>
  )
}

export default function CashierDashboard() {
  return (
    <CashierProvider>
      <CashierDashboardContent />
    </CashierProvider>
  )
} 