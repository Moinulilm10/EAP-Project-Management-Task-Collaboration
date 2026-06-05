"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

// Internal component to hydrate Zustand store from NextAuth session
function SessionHydrator({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const hydrateFromSession = useAuthStore((state) => state.hydrateFromSession);

  useEffect(() => {
    if (status !== "loading") {
      hydrateFromSession(session);
    }
  }, [session, status, hydrateFromSession]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionHydrator>{children}</SessionHydrator>
    </SessionProvider>
  );
}
