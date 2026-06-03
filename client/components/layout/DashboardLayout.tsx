"use client";

import React, { useState } from "react";
import { SideNavBar } from "./SideNavBar";
import { TopNavBar } from "./TopNavBar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenMenu = () => setIsMobileMenuOpen(true);
  const handleCloseMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-on-background font-body-lg selection:bg-primary-container selection:text-on-primary-container">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-inverse-surface/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={handleCloseMenu}
          aria-hidden="true"
        />
      )}

      {/* Navigation sidebar */}
      <SideNavBar isOpen={isMobileMenuOpen} onClose={handleCloseMenu} />

      {/* Main Canvas & TopNavBar */}
      <div className="flex flex-1 flex-col md:ml-72 min-h-screen">
        <TopNavBar onMenuClick={handleOpenMenu} />
        <main className="flex-1 pt-24 px-margin-mobile md:px-margin-desktop pb-xl overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
