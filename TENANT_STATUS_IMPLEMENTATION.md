# Tenant Status Implementation

This document explains how the tenant status checking system works to prevent users from accessing inactive tenants.

## Overview

The system implements multiple layers of protection to ensure users cannot access the application when their tenant is inactive:

1. **Server-side middleware protection** - Blocks access at the request level
2. **Client-side status checking** - Provides real-time status updates
3. **User-friendly error pages** - Clear messaging when access is denied

## Components

### 1. Middleware Protection (`src/middleware.ts`)

The middleware checks tenant status for all authenticated users (except super admins) and redirects to `/tenant-inactive` if the tenant is inactive.

```typescript
// Check if tenant is inactive (for non-super admin users)
if (token.role !== "superAdmin" && token.tenantStatus === "INACTIVE") {
  return NextResponse.redirect(new URL('/tenant-inactive', request.url));
}
```

### 2. Authentication Token Enhancement (`src/auth.ts`)

The authentication token now includes tenant status information:

```typescript
token.tenantStatus = tenantUser?.tenant?.status || null;
```

### 3. API Endpoint (`src/app/api/tenant/status/route.ts`)

Provides real-time tenant status information for client-side validation.

**Endpoint:** `GET /api/tenant/status`

**Response:**
```json
{
  "tenantId": "tenant_id",
  "tenantName": "Tenant Name",
  "status": "ACTIVE|INACTIVE",
  "subscriptionStatus": "ACTIVE|INACTIVE",
  "subscriptionEndDate": "2024-01-01T00:00:00Z",
  "isActive": true
}
```

### 4. React Hook (`src/hooks/useTenantStatus.ts`)

Custom hook for checking tenant status in React components:

```typescript
const { tenantStatus, isLoading, error, refetch } = useTenantStatus();
```

### 5. Warning Component (`src/components/TenantStatusWarning.tsx`)

Displays a warning banner when tenant is inactive:

```typescript
<TenantStatusWarning showRefreshButton={true} />
```

### 6. Guard Component (`src/components/TenantStatusGuard.tsx`)

Higher-order component that automatically handles tenant status checking:

```typescript
<TenantStatusGuard showWarning={true} redirectOnInactive={true}>
  {children}
</TenantStatusGuard>
```

### 7. Inactive Tenant Page (`src/app/tenant-inactive/page.tsx`)

User-friendly page shown when tenant is inactive.

## Usage Examples

### 1. Protecting Admin Layout

```typescript
// src/app/admin/layout.tsx
import { TenantStatusGuard } from "@/components/TenantStatusGuard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TenantStatusGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </TenantStatusGuard>
  )
}
```

### 2. Adding Warning to Dashboard

```typescript
// src/app/admin/page.tsx
import { TenantStatusWarning } from "@/components/TenantStatusWarning"

export default function AdminDashboard() {
  return (
    <div>
      <TenantStatusWarning />
      {/* Dashboard content */}
    </div>
  )
}
```

### 3. Manual Status Check in Component

```typescript
import { useTenantStatus } from "@/hooks/useTenantStatus"

export default function MyComponent() {
  const { tenantStatus, isLoading } = useTenantStatus()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!tenantStatus?.isActive) {
    return <div>Your tenant is inactive</div>
  }

  return <div>Your tenant is active</div>
}
```

## Database Schema

The tenant status is stored in the `Tenant` model:

```prisma
model Tenant {
  id                   String       @id @default(cuid())
  name                 String
  status               String       @default("INACTIVE")  // ACTIVE or INACTIVE
  // ... other fields
}
```

## Status Values

- `ACTIVE`: Tenant is active and users can access the application
- `INACTIVE`: Tenant is inactive and users are blocked from access

## Super Admin Exception

Super admins are exempt from tenant status checks and can always access the application, regardless of tenant status.

## Testing

To test the implementation:

1. **Set a tenant to inactive:**
   ```sql
   UPDATE "Tenant" SET status = 'INACTIVE' WHERE id = 'tenant_id';
   ```

2. **Try to access the application** - users should be redirected to `/tenant-inactive`

3. **Set tenant back to active:**
   ```sql
   UPDATE "Tenant" SET status = 'ACTIVE' WHERE id = 'tenant_id';
   ```

4. **Refresh the page** - users should now have access again

## Security Considerations

- Tenant status is checked on every request via middleware
- Client-side checks provide real-time feedback but are not the primary security layer
- Super admin access is preserved for administrative purposes
- All tenant status changes should be logged for audit purposes
