"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";
import "../../i18n";

interface TopNavBarProps {
  onMenuClick?: () => void;
}

export function TopNavBar({ onMenuClick }: TopNavBarProps) {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop ml-auto">
      {/* Mobile brand and menu trigger */}
      <div className="flex items-center gap-sm md:hidden">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="text-on-surface-variant hover:text-primary p-1 rounded-md hover:bg-surface-container-high/40 transition-colors"
            aria-label={t("menu") as string}
          >
            <span className="material-symbols-outlined">{t("menu")}</span>
          </button>
        )}
        <Link href="/" className="font-headline-md text-headline-md font-black text-primary">
          {t("ProjectFlow")}
        </Link>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:flex items-center relative w-96">
        <span className="material-symbols-outlined absolute left-sm text-on-surface-variant">
          {t("search")}
        </span>
        <input
          className="w-full pl-xl pr-sm py-sm bg-surface-container-low border-none rounded-full text-body-md focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
          placeholder={t("Search projects...") as string}
          type="text"
        />
      </div>

      <div className="flex items-center gap-md">
        <button
          className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-high/40"
          aria-label={t("notifications") as string}
        >
          <span className="material-symbols-outlined">{t("notifications")}</span>
        </button>
        <button
          className="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-full hover:bg-surface-container-high/40"
          aria-label={t("dark_mode") as string}
        >
          <span className="material-symbols-outlined">{t("dark_mode")}</span>
        </button>

        <Button className="hidden md:flex">
          <span className="material-symbols-outlined text-[18px]">{t("add")}</span>
          {t("Create Task")}
        </Button>

        <Link
          href="/login"
          className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden border border-outline-variant/30 cursor-pointer flex items-center justify-center text-on-secondary-container font-bold hover:border-primary transition-colors"
        >
          {t("U")}
        </Link>
      </div>
    </header>
  );
}
