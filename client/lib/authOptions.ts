import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          const data = await res.json();

          if (res.ok && data.user && data.accessToken) {
            // Include tokens in the returned user object
            return {
              ...data.user,
              accessToken: data.accessToken,
              // Note: Refresh token is handled via HttpOnly cookie set by backend
            };
          }
          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes, matching backend access token expiry
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Sync Google user with backend
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'}/auth/google-sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
            }),
          });
          const data = await res.json();
          if (res.ok) {
             // Store the backend access token and role on the user object temporarily
            (user as any).accessToken = data.accessToken;
            (user as any).role = data.user.role;
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
        // Assume access token expires in 15 minutes
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
      }

      // Check if access token is expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to refresh it
      // Note: In Next.js server components/API routes, we'd need to forward the refresh cookie.
      // Since NextAuth runs server-side, it's tricky to proxy the HttpOnly cookie back to the API.
      // For this implementation, we will let the client-side `apiClient` handle token rotation,
      // and NextAuth session will rely on client hydration.
      // Returning token as-is for now; actual 401s will trigger client-side refresh or logout.
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
      }
      (session as any).accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
