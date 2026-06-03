"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface SideNavBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SideNavBar({ isOpen = false, onClose }: SideNavBarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  // Helper to check if a route is active
  const isActive = (path: string) => {
    if (path === "/" || path === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    const base = "flex items-center gap-sm px-sm py-sm rounded-xl font-label-md text-label-md transition-all duration-300";
    if (isActive(path)) {
      return `${base} bg-primary-container/20 text-primary font-bold scale-95`;
    }
    return `${base} text-secondary hover:text-primary hover:bg-surface-container-high/50`;
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-outline-variant/30 bg-surface-container-lowest/90 backdrop-blur-xl py-base px-sm shadow-sm transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute right-sm top-[18px] p-1 text-secondary hover:text-primary rounded hover:bg-surface-container-high transition-colors"
          aria-label={t("close") as string}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}

      <div className="flex items-center gap-sm mb-lg px-sm pt-sm">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
          {t("P")}
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">{t("ProjectFlow")}</h1>
          <p className="font-label-sm text-label-sm text-secondary">{t("Enterprise Pro")}</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-xs">
        <Link href="/" className={getLinkClass("/")} onClick={onClose}>
          <span
            className="material-symbols-outlined"
            style={isActive("/") ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {t("dashboard")}
          </span>
          {t("Dashboard")}
        </Link>
        <Link href="/projects" className={getLinkClass("/projects")} onClick={onClose}>
          <span
            className="material-symbols-outlined"
            style={isActive("/projects") ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {t("folder")}
          </span>
          {t("Projects")}
        </Link>
        <Link href="#" className={getLinkClass("/tasks")} onClick={onClose}>
          <span className="material-symbols-outlined">{t("assignment")}</span>
          {t("Tasks")}
        </Link>
        <Link href="/team" className={getLinkClass("/team")} onClick={onClose}>
          <span className="material-symbols-outlined">{t("group")}</span>
          {t("Team")}
        </Link>
        <Link href="/analytics" className={getLinkClass("/analytics")} onClick={onClose}>
          <span className="material-symbols-outlined">{t("analytics")}</span>
          {t("Analytics")}
        </Link>
        <Link href="/settings" className={getLinkClass("/settings")} onClick={onClose}>
          <span className="material-symbols-outlined">{t("settings")}</span>
          {t("Settings")}
        </Link>
      </nav>

      <div className="mt-auto flex flex-col gap-sm">
        <Button variant="primary" className="w-full">
          {t("Upgrade Plan")}
        </Button>
        <div className="h-px w-full bg-outline-variant/30 my-xs"></div>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-xs text-secondary hover:text-primary transition-colors duration-200 font-label-md text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">{t("help")}</span>
          {t("Help Center")}
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-sm px-sm py-xs text-secondary hover:text-primary transition-colors duration-200 font-label-md text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">{t("logout")}</span>
          {t("Log Out")}
        </Link>
      </div>
    </aside>
  );
}
