import { auth } from "@/auth";

export type UserRole = "OWNER" | "MANAGER" | "CASHIER" | "superAdmin";

export interface UserPermissions {
  canAccessAdmin: boolean;
  canAccessManager: boolean;
  canAccessCashier: boolean;
  canManageUsers: boolean;
  canManageProducts: boolean;
  canViewAnalytics: boolean;
  canManageTenants: boolean;
  isSuperAdmin: boolean;
}

export function getUserPermissions(role: UserRole | null): UserPermissions {
  return {
    canAccessAdmin: role === "OWNER" || role === "superAdmin",
    canAccessManager: role === "OWNER" || role === "MANAGER" || role === "superAdmin",
    canAccessCashier: role === "OWNER" || role === "MANAGER" || role === "CASHIER" || role === "superAdmin",
    canManageUsers: role === "OWNER" || role === "superAdmin",
    canManageProducts: role === "OWNER" || role === "MANAGER" || role === "superAdmin",
    canViewAnalytics: role === "OWNER" || role === "superAdmin",
    canManageTenants: role === "superAdmin",
    isSuperAdmin: role === "superAdmin",
  };
}

export function requireRole(requiredRoles: UserRole[]): boolean {
  // This function can be used in server components
  // You would get the session and check if user has required role
  return true; // Placeholder - implement based on your needs
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export function canAccessRoute(userRole: UserRole | null, route: string): boolean {
  const routeAccess = {
    "/admin": ["OWNER", "superAdmin"],
    "/admin/analytics": ["OWNER", "superAdmin"],
    "/admin/customers": ["OWNER", "superAdmin"],
    "/admin/products": ["OWNER", "superAdmin"],
    "/admin/reports": ["OWNER", "superAdmin"],
    "/admin/sales": ["OWNER", "superAdmin"],
    "/admin/settings": ["OWNER", "superAdmin"],
    "/admin/tenants": ["superAdmin"],
    "/admin/users": ["OWNER", "superAdmin"],
    "/admin/super-admin": ["superAdmin"],
    "/manager": ["OWNER", "MANAGER", "superAdmin"],
    "/manager/dashboard": ["OWNER", "MANAGER", "superAdmin"],
    "/cashier": ["OWNER", "MANAGER", "CASHIER", "superAdmin"],
    "/cashier/": ["OWNER", "MANAGER", "CASHIER", "superAdmin"],
  };

  const requiredRoles = routeAccess[route as keyof typeof routeAccess];
  return requiredRoles ? requiredRoles.includes(userRole as UserRole) : true;
} 