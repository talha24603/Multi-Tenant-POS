"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ShoppingCart, Clock, LogOut } from "lucide-react"

const navigation = [
  { name: "New Sale", href: "/cashier", icon: ShoppingCart },
  { name: "Recent Sales", href: "/cashier/recent", icon: Clock },
]

export function CashierSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-20 flex-col bg-white border-r border-gray-200 items-center py-4">
      <div className="mb-8">
        <span className="text-2xl font-bold text-blue-600">POS</span>
      </div>
      <nav className="flex-1 flex flex-col gap-6 items-center">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-100 hover:text-blue-700"
              )}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto mb-2">
        <button className="flex flex-col items-center text-gray-400 hover:text-red-600 p-2">
          <LogOut className="h-6 w-6 mb-1" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </div>
  )
} 