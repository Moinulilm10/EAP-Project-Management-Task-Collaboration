"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";
import {
  MdClose,
  MdOutlineDashboard,
  MdDashboard,
  MdOutlineFolder,
  MdFolder,
  MdAssignment,
  MdGroup,
  MdAnalytics,
  MdSettings,
  MdHelpOutline,
  MdLogout,
} from "react-icons/md";
import "../../i18n";

interface SideNavBarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function SideNavBar({ isOpen = false, onClose }: SideNavBarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
      return `${base} bg-primary-container/20 text-primary font-bold`;
    }
    return `${base} text-secondary hover:text-primary hover:bg-surface-container-high/50`;
  };

  const logoSrc = mounted && resolvedTheme === "dark"
    ? "/img/logo-dark-mode.png"
    : "/img/logo-light-mode.png";

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-outline-variant/30 bg-surface-container-lowest/90 backdrop-blur-xl py-base px-sm shadow-sm transition-transform duration-300 md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="md:hidden absolute right-sm top-[18px] p-1 text-secondary hover:text-primary rounded hover:bg-surface-container-high transition-colors"
          aria-label={t("close") as string}
        >
          <MdClose className="w-6 h-6" />
        </button>
      )}

      <div className="flex items-center gap-sm mb-lg px-sm pt-sm">
        <Image
          src={logoSrc}
          alt="ProjectFlow Logo"
          width={65}
          height={65}
          className="rounded-lg"
        />
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">{t("ProjectFlow")}</h1>
          <p className="font-label-sm text-label-sm text-secondary">{t("Enterprise Pro")}</p>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-xs">
        <Link href="/" className={getLinkClass("/")} onClick={onClose}>
          {isActive("/") ? (
            <MdDashboard className="w-5 h-5" />
          ) : (
            <MdOutlineDashboard className="w-5 h-5" />
          )}
          {t("Dashboard")}
        </Link>
        <Link href="/projects" className={getLinkClass("/projects")} onClick={onClose}>
          {isActive("/projects") ? (
            <MdFolder className="w-5 h-5" />
          ) : (
            <MdOutlineFolder className="w-5 h-5" />
          )}
          {t("Projects")}
        </Link>
        <Link href="/tasks" className={getLinkClass("/tasks")} onClick={onClose}>
          <MdAssignment className="w-5 h-5" />
          {t("Tasks")}
        </Link>
        <Link href="/team" className={getLinkClass("/team")} onClick={onClose}>
          <MdGroup className="w-5 h-5" />
          {t("Team")}
        </Link>
        <Link href="/analytics" className={getLinkClass("/analytics")} onClick={onClose}>
          <MdAnalytics className="w-5 h-5" />
          {t("Analytics")}
        </Link>
        <Link href="/settings" className={getLinkClass("/settings")} onClick={onClose}>
          <MdSettings className="w-5 h-5" />
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
          className="flex items-center gap-sm px-sm py-xs text-secondary hover:text-primary transition-colors duration-200 font-label-md text-label-md cursor-pointer"
        >
          <MdHelpOutline className="w-[18px] h-[18px]" />
          {t("Help Center")}
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-sm px-sm py-xs text-secondary hover:text-error transition-colors duration-200 font-label-md text-label-md cursor-pointer"
        >
          <MdLogout className="w-[18px] h-[18px]" />
          {t("Log Out")}
        </Link>
      </div>
    </aside>
  );
}
