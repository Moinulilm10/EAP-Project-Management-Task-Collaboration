"use client";

import { useAuthStore } from "@/stores/authStore";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

// Internal component to hydrate Zustand store from NextAuth session
function SessionHydrator({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const hydrateFromSession = useAuthStore((state) => state.hydrateFromSession);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    if (status === "loading") {
      // Tell our app we're syncing auth state so UI shows loading skeletons
      setLoading(true);
      return;
    }

    // Status is not loading: hydrate store from session and clear loading
    hydrateFromSession(session);
  }, [session, status, hydrateFromSession, setLoading]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionHydrator>{children}</SessionHydrator>
    </SessionProvider>
  );
}
