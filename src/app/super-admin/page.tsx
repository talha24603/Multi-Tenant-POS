"use client";
import { TenantsTable } from "@/components/admin/tenants-table";
import { useSession } from "next-auth/react";

export default function SuperAdminDashboard() {
  const { data: session, status } = useSession();
  const isSuperAdmin = session?.user?.role === "superAdmin";

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!isSuperAdmin) {
    return (
      <div className="p-8 text-center text-red-600">
        You do not have permission to access the Super Admin Dashboard.
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight mb-2">Super Admin Dashboard</h2>
      <p className="text-muted-foreground mb-6">Manage all tenants and perform super admin actions.</p>
      <TenantsTable />
    </div>
  );
} 