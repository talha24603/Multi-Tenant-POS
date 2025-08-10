import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface TenantStatus {
  tenantId: string;
  tenantName: string;
  status: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
}

interface UseTenantStatusReturn {
  tenantStatus: TenantStatus | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTenantStatus(): UseTenantStatusReturn {
  const { data: session, status } = useSession();
  const [tenantStatus, setTenantStatus] = useState<TenantStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTenantStatus = async () => {
    if (status !== 'authenticated' || !session?.user) {
      return;
    }

    // Super admin doesn't need to check tenant status
    if (session.user.role === 'superAdmin') {
      setTenantStatus({
        tenantId: '',
        tenantName: 'Super Admin',
        status: 'ACTIVE',
        isActive: true,
        isSuperAdmin: true,
      });
      return;
    }

    // Only set loading if we don't already have tenant status
    if (!tenantStatus) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await fetch('/api/tenant/status');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch tenant status');
      }

      const data = await response.json();
      setTenantStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantStatus();
  }, [session, status]);

  const refetch = () => {
    fetchTenantStatus();
  };

  return {
    tenantStatus,
    isLoading,
    error,
    refetch,
  };
}
