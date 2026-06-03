import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";

export function SideNavBar() {
  return (
    <aside className="hidden md:flex fixed h-screen w-72 left-0 top-0 border-r border-outline-variant/30 bg-surface-container-lowest/70 backdrop-blur-xl shadow-sm z-50 flex-col py-base px-sm">
      <div className="flex items-center gap-sm mb-lg px-sm pt-sm">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
          P
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">ProSync</h1>
          <p className="font-label-sm text-label-sm text-secondary">Enterprise</p>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-xs">
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
          <span className="material-symbols-outlined">dashboard</span>
          Dashboard
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm bg-primary-container/20 text-primary font-bold rounded-xl font-label-md text-label-md scale-95 transition-transform duration-150"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span>
          Projects
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
          <span className="material-symbols-outlined">assignment</span>
          Tasks
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
          <span className="material-symbols-outlined">group</span>
          Team
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
          <span className="material-symbols-outlined">analytics</span>
          Analytics
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
          <span className="material-symbols-outlined">settings</span>
          Settings
        </Link>
      </nav>

      <div className="mt-auto flex flex-col gap-sm">
        <Button variant="primary" className="w-full">
          Upgrade Plan
        </Button>
        <div className="h-px w-full bg-outline-variant/30 my-xs"></div>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-xs text-secondary hover:text-primary transition-colors duration-200 font-label-md text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">help</span>
          Help Center
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-xs text-secondary hover:text-primary transition-colors duration-200 font-label-md text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Log Out
        </Link>
      </div>
    </aside>
  );
}
