import { AdminSidebar } from "@/components/admin/sidebar"
import { TenantStatusWarning } from "@/components/TenantStatusWarning"
import { TenantStatusCheck } from "@/components/TenantStatusCheck"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <TenantStatusCheck />
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <TenantStatusWarning className="mb-4" />
          {children}
        </main>
      </div>
    </>
  )
} 