import { getSession, signOut } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "../stores/authStore";
import { notification } from "./notification";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** Custom error class for API failures — extends Error so Next.js can serialize it properly. */
export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const session = (await getSession()) as any;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (typeof FormData !== "undefined" && options.body instanceof FormData) {
      delete headers["Content-Type"];
    }

    if (session?.accessToken) {
      headers["Authorization"] = `Bearer ${session.accessToken}`;
    }

    // Auto-inject Idempotency-Key for mutating requests if not provided
    if (
      ["POST", "PUT", "PATCH", "DELETE"].includes(
        options.method?.toUpperCase() || "GET",
      )
    ) {
      if (!headers["X-Idempotency-Key"]) {
        headers["X-Idempotency-Key"] = uuidv4();
      }
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    // Need credentials for HttpOnly cookies (refresh token)
    config.credentials = "include";

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle 401 Unauthorized: clear client auth and redirect to login.
      // Do NOT auto-logout on 403 Forbidden — that indicates a permissions issue,
      // not an invalid/expired token.
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          notification.errorToast("Your session has expired. Redirecting to login...");

          try {
            // Clear client-side auth state (Zustand)
            const store = useAuthStore as any;
            store.getState &&
              store.getState().clearAuth &&
              store.getState().clearAuth();
          } catch (e) {
            // swallow any errors while clearing state
          }

          try {
            // Ask NextAuth to sign out (no redirect) to clear server session/cookies if any
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await signOut({ redirect: false });
          } catch (e) {
            // ignore
          }

          // Redirect user to login page after a brief delay so they can read the toast
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);

          // Prevent further execution for this request to avoid secondary errors
          await new Promise(() => {}); 
        }
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data?.message || data?.error || "API request failed",
          data?.details,
        );
      }

      return data as T;
    } catch (error) {
      // Re-wrap non-Error objects (e.g. network failures) into proper Errors
      if (error instanceof Error) throw error;
      throw new ApiError(0, String(error));
    }
  }

  get<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  post<T>(endpoint: string, body?: any, options?: RequestInit) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  put<T>(endpoint: string, body?: any, options?: RequestInit) {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    });
  }

  delete<T>(endpoint: string, options?: RequestInit) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
