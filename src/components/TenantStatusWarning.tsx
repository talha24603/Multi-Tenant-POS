"use client"
import { useTenantStatus } from "@/hooks/useTenantStatus";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface TenantStatusWarningProps {
  showRefreshButton?: boolean;
  className?: string;
}

export function TenantStatusWarning({ 
  showRefreshButton = true, 
  className = "" 
}: TenantStatusWarningProps) {
  const { tenantStatus, isLoading, refetch } = useTenantStatus();

  // Don't show anything while loading or if no tenant status
  if (isLoading || !tenantStatus) {
    return null;
  }

  // Don't show warning for super admin or active tenants
  if (tenantStatus.isSuperAdmin || tenantStatus.isActive) {
    return null;
  }

  // Only show warning if tenant is explicitly inactive
  if (tenantStatus.status !== "INACTIVE") {
    return null;
  }

  return (
    <Alert variant="destructive" className={className}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Tenant Inactive</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          Your tenant "{tenantStatus.tenantName}" is currently inactive. 
          Please contact your administrator for assistance.
        </span>
        {showRefreshButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            className="ml-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
