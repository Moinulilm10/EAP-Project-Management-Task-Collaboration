import React from "react";

export function PageWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={`flex-1 mt-16 md:ml-72 flex flex-col min-h-[calc(100vh-64px)] w-full max-w-[1600px] mx-auto p-margin-mobile md:p-margin-desktop ${className}`}>
      {children}
    </main>
  );
}
