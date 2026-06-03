import React from "react";
import { SideNavBar } from "./SideNavBar";
import { TopNavBar } from "./TopNavBar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
      <SideNavBar />
      <TopNavBar />
      <main className="flex-1 pt-24 px-margin-mobile md:px-margin-desktop pb-xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
