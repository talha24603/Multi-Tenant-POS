import React from "react";
import Link from "next/link";

export default function ManagerDashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-1">Manager Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here’s an overview of your business performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-card rounded-xl shadow p-6 flex flex-col items-start border border-border">
          <span className="text-muted-foreground text-sm mb-1">Total Sales</span>
          <span className="text-2xl font-bold">$12,400</span>
        </div>
        <div className="bg-card rounded-xl shadow p-6 flex flex-col items-start border border-border">
          <span className="text-muted-foreground text-sm mb-1">Customers</span>
          <span className="text-2xl font-bold">320</span>
        </div>
        <div className="bg-card rounded-xl shadow p-6 flex flex-col items-start border border-border">
          <span className="text-muted-foreground text-sm mb-1">Products</span>
          <span className="text-2xl font-bold">58</span>
        </div>
        <div className="bg-card rounded-xl shadow p-6 flex flex-col items-start border border-border">
          <span className="text-muted-foreground text-sm mb-1">Stock Alerts</span>
          <span className="text-2xl font-bold">4</span>
        </div>
      </div>

      {/* Sales Chart & Recent Sales */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Sales Chart Placeholder */}
        <div className="bg-card rounded-xl shadow p-6 border border-border col-span-2 flex flex-col">
          <h2 className="font-semibold mb-4">Sales Analytics</h2>
          <div className="flex-1 flex items-center justify-center text-muted-foreground h-48">
            [Sales Chart Placeholder]
          </div>
        </div>
        {/* Recent Sales Table Placeholder */}
        <div className="bg-card rounded-xl shadow p-6 border border-border flex flex-col">
          <h2 className="font-semibold mb-4">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="px-2 py-1 text-left">Date</th>
                  <th className="px-2 py-1 text-left">Customer</th>
                  <th className="px-2 py-1 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1">2024-06-01</td>
                  <td className="px-2 py-1">Jane Doe</td>
                  <td className="px-2 py-1">$120</td>
                </tr>
                <tr>
                  <td className="px-2 py-1">2024-06-01</td>
                  <td className="px-2 py-1">John Smith</td>
                  <td className="px-2 py-1">$85</td>
                </tr>
                <tr>
                  <td className="px-2 py-1">2024-05-31</td>
                  <td className="px-2 py-1">Acme Corp</td>
                  <td className="px-2 py-1">$340</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto flex flex-wrap gap-4">
        <Link href="/admin/products" className="bg-primary text-primary-foreground px-5 py-3 rounded-lg font-medium shadow hover:bg-primary/90 transition">
          Add Product
        </Link>
        <Link href="/admin/reports" className="bg-secondary text-secondary-foreground px-5 py-3 rounded-lg font-medium shadow hover:bg-secondary/80 transition">
          View Reports
        </Link>
        <Link href="/admin/customers" className="bg-secondary text-secondary-foreground px-5 py-3 rounded-lg font-medium shadow hover:bg-secondary/80 transition">
          Manage Customers
        </Link>
      </div>
    </div>
  );
} 