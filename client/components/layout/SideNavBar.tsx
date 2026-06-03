"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";
import "../../i18n";

export function SideNavBar() {
  const { t } = useTranslation();

  return (
    <aside className="hidden md:flex fixed h-screen w-72 left-0 top-0 border-r border-outline-variant/30 bg-surface-container-lowest/70 backdrop-blur-xl shadow-sm z-50 flex-col py-base px-sm">
      <div className="flex items-center gap-sm mb-lg px-sm pt-sm">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
          {t("P")}
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">{t("ProSync")}</h1>
          <p className="font-label-sm text-label-sm text-secondary">{t("Enterprise")}</p>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col gap-xs">
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
          <span className="material-symbols-outlined">{t("dashboard")}</span>
          {t("Dashboard")}
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm bg-primary-container/20 text-primary font-bold rounded-xl font-label-md text-label-md scale-95 transition-transform duration-150"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{t("folder")}</span>
          {t("Projects")}
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
          <span className="material-symbols-outlined">{t("assignment")}</span>
          {t("Tasks")}
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
          <span className="material-symbols-outlined">{t("group")}</span>
          {t("Team")}
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
          <span className="material-symbols-outlined">{t("analytics")}</span>
          {t("Analytics")}
        </Link>
        <Link
          href="#"
          className="flex items-center gap-sm px-sm py-sm text-secondary hover:text-primary hover:bg-surface-container-high/50 transition-all duration-300 rounded-xl font-label-md text-label-md group"
        >
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
          href="#"
          className="flex items-center gap-sm px-sm py-xs text-secondary hover:text-primary transition-colors duration-200 font-label-md text-label-md"
        >
          <span className="material-symbols-outlined text-[18px]">{t("logout")}</span>
          {t("Log Out")}
        </Link>
      </div>
    </aside>
  );
}
