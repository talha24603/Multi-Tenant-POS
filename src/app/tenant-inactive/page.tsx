"use client"
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, LogOut, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function TenantInactivePage() {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Access Unavailable</CardTitle>
          <CardDescription>
            {session?.user?.subscriptionStatus === "INACTIVE" ||
            (session?.user?.subscriptionEndDate && new Date(session.user.subscriptionEndDate) < new Date())
              ? "Your subscription has ended. Please renew your subscription to regain access."
              : "Your tenant is currently inactive. Please contact your administrator for assistance."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Tenant:</strong> {session?.user?.tenantName || "Unknown"}<br />
              <strong>Tenant Status:</strong> {session?.user?.tenantStatus || "INACTIVE"}<br />
              <strong>Subscription:</strong> {session?.user?.subscriptionStatus || "INACTIVE"}
              {session?.user?.subscriptionEndDate ? ` (ended on ${new Date(session.user.subscriptionEndDate).toLocaleDateString()})` : ""}<br />
              <strong>User:</strong> {session?.user?.email}
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Link href="/buy-tenant">
              <Button variant="outline" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Buy New Subscription
              </Button>
            </Link>
            <Button onClick={handleSignOut} variant="destructive" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            If you believe this is an error, please contact your system administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
