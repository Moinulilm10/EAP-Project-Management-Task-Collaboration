"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const PUBLIC_ROUTES = ["/login", "/signup"];

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      // Redirect unauthenticated users to login
      router.push("/login");
    } else if (isAuthenticated && isPublicRoute) {
      // Redirect authenticated users away from public routes like login
      router.push("/dashboard");
    } else if (isAuthenticated && allowedRoles && user) {
      // Check RBAC permissions if route specifies allowed roles
      if (!allowedRoles.includes(user.role)) {
        // Simple fallback for unauthorized access
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, pathname, user, router, allowedRoles]);

  if (isLoading) {
    // Elegant loading state (matching design system)
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Only render children if user is allowed to see the route
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if (!isAuthenticated && !isPublicRoute) return null;
  if (isAuthenticated && isPublicRoute) return null;
  if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
