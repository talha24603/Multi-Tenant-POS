import { CashierSidebar } from "@/components/cashier/sidebar"

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <CashierSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
} 