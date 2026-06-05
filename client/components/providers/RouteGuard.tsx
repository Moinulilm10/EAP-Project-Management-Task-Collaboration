"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Image from "next/image";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const PUBLIC_ROUTES = ["/login", "/signup"];

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { resolvedTheme } = useTheme();
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
    // Premium loading state matching the design system
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface transition-colors duration-500">
        <div className="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-lg text-center"
        >
          {/* Logo container with pulsing outer ring */}
          <div className="relative">
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/30 to-secondary/30 blur-xl"
            />
            
            <motion.div 
              className="relative w-20 h-20 bg-surface-container border border-outline-variant/30 rounded-2xl shadow-xl flex items-center justify-center p-xs overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={resolvedTheme === "dark" ? "/img/logo-dark-mode.png" : "/img/logo-light-mode.png"}
                alt="ProjectFlow Logo"
                width={72}
                height={72}
                className="w-full h-full object-contain"
                priority
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-xs">
            <motion.h3 
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="font-title-lg text-title-lg text-on-surface font-semibold tracking-tight"
            >
              Securing Session
            </motion.h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[240px]">
              Syncing with security backend...
            </p>
          </div>

          {/* Micro-loading progress bar */}
          <div className="w-48 h-1 bg-outline-variant/30 rounded-full overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              animate={{ 
                left: ["-100%", "100%"] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ width: "60%" }}
            />
          </div>
        </motion.div>
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
