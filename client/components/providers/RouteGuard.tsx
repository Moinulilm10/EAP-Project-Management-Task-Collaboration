"use client";

import { useAuthStore } from "@/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const PUBLIC_ROUTES = ["/login", "/signup"];

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Defer mount flag to avoid synchronous setState inside effect
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Redirect and access control logic in a separate effect
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

  if (!mounted || isLoading) {
    return <div className="min-h-screen bg-surface" />;
  }

  // Only render children if user is allowed to see the route
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if (!isAuthenticated && !isPublicRoute) return null;
  if (isAuthenticated && isPublicRoute) return null;
  if (
    isAuthenticated &&
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  )
    return null;

  return <>{children}</>;
}
