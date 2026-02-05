// app/success/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface SessionDetails {
  status: string;
  subscriptionId: string;
  plan: string;
  currentPeriodEnd: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { status: authStatus, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<SessionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncingAccess, setSyncingAccess] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided.');
      setLoading(false);
      return;
    }

    async function fetchSession() {
      try {
        const res = await fetch(
          `/api/retrieve-session?session_id=${sessionId}`
        );
        const data = await res.json();
        if (res.ok) {
          setDetails(data);
        } else {
          setError(data.error || 'Failed to retrieve session.');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  // Refresh NextAuth JWT/session claims after webhook updates DB.
  // Without this, middleware may keep using stale INACTIVE values.
  useEffect(() => {
    let cancelled = false;

    async function syncSessionFromDb() {
      if (authStatus !== 'authenticated') return;
      if (typeof update !== 'function') return;

      setSyncingAccess(true);
      try {
        // Retry a few times to avoid race with Stripe webhook processing.
        for (let attempt = 0; attempt < 6; attempt++) {
          if (cancelled) return;
          await update();

          const res = await fetch('/api/tenant/status');
          if (res.ok) {
            const data = await res.json();
            if (data?.isActive) {
              return;
            }
          }

          await new Promise((r) => setTimeout(r, 1000));
        }
      } finally {
        if (!cancelled) setSyncingAccess(false);
      }
    }

    syncSessionFromDb();
    return () => {
      cancelled = true;
    };
  }, [authStatus, update]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p className="mt-2">{error}</p>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background text-foreground">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground">Your subscription has been activated successfully.</p>
      </div>
      
      {details && (
        <div className="bg-card shadow-md rounded-lg p-6 mb-6 w-full max-w-md">
          <h3 className="font-semibold mb-4">Subscription Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-medium">{details.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-green-600">{details.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valid Until:</span>
              <span className="font-medium">{new Date(details.currentPeriodEnd).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}

      {syncingAccess && (
        <div className="mb-6 w-full max-w-md text-center text-sm text-muted-foreground">
          Finalizing your access… this can take a few seconds.
        </div>
      )}
      
      <div className="space-y-4 w-full max-w-md">
        <Link
          href="/admin/tenant-setup"
          className="w-full inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition text-center"
        >
          Complete Tenant Setup
        </Link>
        <Link
          href="/admin"
          className="w-full inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition text-center"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
