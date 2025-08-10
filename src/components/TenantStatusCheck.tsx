"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTenantStatus } from '@/hooks/useTenantStatus';

interface TenantStatusCheckProps {
  redirectOnInactive?: boolean;
}

export function TenantStatusCheck({ redirectOnInactive = true }: TenantStatusCheckProps) {
  const { data: session, status } = useSession();
  const { tenantStatus, isLoading } = useTenantStatus();
  const router = useRouter();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Check as soon as we have session and tenant status
    if (status === 'authenticated' && session?.user && tenantStatus && !isLoading && !hasChecked) {
      setHasChecked(true);
      
      // Don't redirect super admin
      if (session.user.role === 'superAdmin') {
        return;
      }

      // Redirect if tenant is inactive and redirectOnInactive is true
      if (redirectOnInactive && tenantStatus.status === "INACTIVE") {
        router.push('/tenant-inactive');
      }
    }
  }, [tenantStatus, isLoading, status, session, redirectOnInactive, router, hasChecked]);

  // This component doesn't render anything visible
  return null;
}
