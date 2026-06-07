import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProSync Task Management System",
  description: "Enterprise project management",
  icons: {
    icon: "/img/favicon.png",
  },
};

import { ThemeProvider } from "../components/providers/ThemeProvider";
import { AuthProvider } from "../components/providers/AuthProvider";
import { RouteGuard } from "../components/providers/RouteGuard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <RouteGuard>
              {children}
            </RouteGuard>
            <ToastContainer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
