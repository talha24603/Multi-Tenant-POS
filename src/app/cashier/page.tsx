import { CashierHeader } from "@/components/cashier/header"
import { CartPanel } from "@/components/cashier/cart-panel"
import { ProductSearch } from "@/components/cashier/product-search"
import { CustomerQuickAdd } from "@/components/cashier/customer-quick-add"
import { PaymentPanel } from "@/components/cashier/payment-panel"
import { RecentSales } from "@/components/cashier/recent-sales"

export default function CashierDashboard() {
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
        <div className="space-y-4">
          <PaymentPanel />
          <RecentSales />
        </div>
      </div>
    </div>
  )
} 