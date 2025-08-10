import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

interface Token {
  role?: string;
  tenantId?: string;
  tenantStatus?: string;
  subscriptionStatus?: string | null;
  subscriptionEndDate?: string | null;
  isVerified?: boolean;
  exp?: number;
  // ... other user properties
}

export async function middleware(request: NextRequest) {
  const secret = process.env.AUTH_SECRET;
  const token = (await getToken({
    req: request,
    secret,
    secureCookie: process.env.NODE_ENV === 'production',
  })) as Token | null;

  const url = request.nextUrl;
  const pathname = url.pathname;
  const now = Math.floor(Date.now() / 1000);

  console.log("🔍 Middleware Debug:", {
    pathname,
    userRole: token?.role,
    userTenantId: token?.tenantId,
    tenantStatus: token?.tenantStatus,
    isSuperAdmin: token?.role === "superAdmin",
    hasToken: !!token
  });

  // Check if token has expired
  if (token?.exp && token.exp < now) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Define public pages that don't require authentication
  const publicPages = ["/", "/buy-tenant", "/sign-in", "/sign-up", "/verifyCode", "/success", "/tenant-inactive"];

  // Redirect authenticated users from auth pages
  if (
    token &&
    (pathname === '/sign-in' || pathname === '/sign-up' || pathname.startsWith('/verifyCode'))
  ) {
    // Redirect authenticated users to their dashboard instead of home
    const userRole = token.role;
    const userTenantId = token.tenantId;
    
    if (userRole === "superAdmin") {
      return NextResponse.redirect(new URL('/super-admin', request.url));
    } else if (userRole === "OWNER") {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (userRole === "MANAGER") {
      return NextResponse.redirect(new URL('/manager/dashboard', request.url));
    } else if (userRole === "CASHIER") {
      return NextResponse.redirect(new URL('/cashier', request.url));
    } else if (!userTenantId && userRole !== "superAdmin") {
      return NextResponse.redirect(new URL('/buy-tenant', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirect authenticated users with roles from home page to their dashboard
  if (token && pathname === "/" && token.role) {
    const userRole = token.role;
    const userTenantId = token.tenantId;
    
    if (userRole === "superAdmin") {
      return NextResponse.redirect(new URL('/super-admin', request.url));
    } else if (userRole === "OWNER") {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (userRole === "MANAGER") {
      return NextResponse.redirect(new URL('/manager/dashboard', request.url));
    } else if (userRole === "CASHIER") {
      return NextResponse.redirect(new URL('/cashier', request.url));
    } else if (!userTenantId && userRole !== "superAdmin") {
      return NextResponse.redirect(new URL('/buy-tenant', request.url));
    }
  }

  // If it's a public page, allow access
  if (publicPages.includes(pathname)) {
    return NextResponse.next();
  }

  // Protect routes from unauthenticated users
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If user is not verified, redirect to verification page
  if (!token.isVerified) {
    return NextResponse.redirect(new URL('/verifyCode', request.url));
  }

  // Check if tenant is inactive (for non-super admin users)
  console.log("🔍 Tenant Status Check:", {
    hasToken: !!token,
    userRole: token?.role,
    tenantStatus: token?.tenantStatus,
    isSuperAdmin: token?.role === "superAdmin",
    pathname: pathname
  });
  
  // Consider subscription status: if ended/inactive, redirect to inactive page
  const isSubscriptionInactive = token?.subscriptionStatus === "INACTIVE" || !!(token?.subscriptionEndDate && new Date(token.subscriptionEndDate) < new Date());

  if (
    token?.role &&
    token.role !== "superAdmin" &&
    (token.tenantStatus === "INACTIVE" || isSubscriptionInactive) &&
    pathname !== "/tenant-inactive"
  ) {
    console.log("🚫 User accessing inactive tenant:", {
      userRole: token.role,
      tenantId: token.tenantId,
      tenantStatus: token.tenantStatus,
      subscriptionStatus: token.subscriptionStatus,
      subscriptionEndDate: token.subscriptionEndDate,
      pathname: pathname
    });
    return NextResponse.redirect(new URL('/tenant-inactive', request.url));
  }

  const userRole = token.role;
  const userTenantId = token.tenantId;

  // Super admin special handling - they don't need tenants
  if (userRole === "superAdmin") {
    console.log("✅ Super admin detected, allowing access to admin routes");
    // Super admin can access all admin routes
    if (pathname.startsWith("/admin")) {
      console.log("✅ Super admin accessing admin route:", pathname);
      return NextResponse.next();
    }
    // Redirect super admin to their dashboard
    console.log("🔄 Redirecting super admin to dashboard");
    return NextResponse.redirect(new URL("/admin/super-admin", request.url));
  }

  // If user has no tenant assigned, redirect to buy tenant page
  // (This only applies to non-super admin users)
  if (!userTenantId && pathname !== "/success" && pathname !== "/admin/tenant-setup") {
    return NextResponse.redirect(new URL("/buy-tenant", request.url));
  }

  // Redirect OWNER from non-admin routes
  if (userRole === "OWNER" && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Redirect MANAGER from non-manager routes
  if (userRole === "MANAGER" && !pathname.startsWith('/manager') && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/manager/dashboard', request.url));
  }

  // Redirect CASHIER from unauthorized routes
  if (userRole === "CASHIER" && !pathname.startsWith('/cashier') && !pathname.startsWith('/manager') && !pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/cashier', request.url));
  }

  // Prevent non-OWNER users from accessing admin routes
  if (
    userRole !== "OWNER" &&
    (pathname.startsWith('/admin') && pathname !== '/admin/super-admin')
  ) {
    if (userRole === "MANAGER") {
      return NextResponse.redirect(new URL('/manager/dashboard', request.url));
    } else if (userRole === "CASHIER") {
      return NextResponse.redirect(new URL('/cashier', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Prevent non-MANAGER/OWNER users from accessing manager routes
  if (
    userRole !== "MANAGER" &&
    userRole !== "OWNER" &&
    pathname.startsWith('/manager')
  ) {
    if (userRole === "CASHIER") {
      return NextResponse.redirect(new URL('/cashier', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/manager/:path*',
    '/cashier/:path*',
    '/buy-tenant',
    '/sign-in',
    '/sign-up',
    '/verifyCode/:path*',
    '/success',
    '/tenant-inactive',
    '/api/debug/:path*',
    '/test-token',
    '/',
  ],
};