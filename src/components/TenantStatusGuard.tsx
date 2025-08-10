"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTenantStatus } from '@/hooks/useTenantStatus';
import { TenantStatusWarning } from './TenantStatusWarning';

interface TenantStatusGuardProps {
  children: React.ReactNode;
  showWarning?: boolean;
  redirectOnInactive?: boolean;
}

export function TenantStatusGuard({ 
  children, 
  showWarning = true,
  redirectOnInactive = true 
}: TenantStatusGuardProps) {
  const { data: session, status } = useSession();
  const { tenantStatus, isLoading } = useTenantStatus();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect if still loading or if user is not authenticated
    if (isLoading || status !== 'authenticated' || !session?.user) {
      return;
    }

    // Don't redirect super admin
    if (session.user.role === 'superAdmin') {
      return;
    }

    // Redirect if tenant is inactive and redirectOnInactive is true
    if (redirectOnInactive && tenantStatus && !tenantStatus.isActive) {
      router.push('/tenant-inactive');
    }
  }, [tenantStatus, isLoading, status, session, redirectOnInactive, router]);

  // Don't show loading spinner on initial load to avoid poor UX
  // Instead, render children immediately and let the warning component handle status
  if (isLoading && status === 'loading') {
    return <>{children}</>;
  }

  return (
    <>
      {showWarning && <TenantStatusWarning />}
      {children}
    </>
  );
}
