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
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });

          const data = await res.json();

          if (res.ok && data.user && data.accessToken) {
            // Include tokens in the returned user object
            return {
              ...data.user,
              image: data.user.picture,
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
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google-sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              picture: user.image,
            }),
          });
          const data = await res.json();
          if (res.ok) {
            // Store the backend access token on the user object temporarily
            (user as any).accessToken = data.accessToken;
            (user as any).picture = data.user?.picture || user.image;
            return true;
          }
          return false;
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.accessToken = (user as any).accessToken;
        // Assume access token expires in 15 minutes
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        token.picture = (user as any).picture || user.image;
      }
      
      // Handle session updates (e.g. name or picture change)
      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.image) token.picture = session.user.image;
        if (session.user.picture) token.picture = session.user.picture;
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
      (session as any).accessToken = token.accessToken as string;
      if (session.user) {
        session.user.image = (token as any).picture || (token as any).image || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
