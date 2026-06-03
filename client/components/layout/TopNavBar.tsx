"use client";

import React from "react";
import Link from "next/link";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { IconButton } from "../ui/IconButton";
import { Avatar } from "../ui/Avatar";
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
      <div className="hidden md:flex items-center w-96 relative">
        <Input icon="search" placeholder={t("Search workspace...") as string} />
      </div>

      <div className="flex items-center gap-md">
        <Button className="hidden md:flex">
          <span className="material-symbols-outlined text-[18px]">{t("add")}</span>
          {t("Create Task")}
        </Button>

        <div className="flex items-center gap-xs">
          <IconButton icon="notifications" aria-label={t("notifications") as string} />
          <IconButton icon="dark_mode" aria-label={t("dark mode") as string} />
        </div>

        <div className="h-8 w-px bg-outline-variant/40 mx-xs hidden lg:block"></div>

        <Link href="/login">
          <Avatar
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-sE0_3Oy-ZLOQDutQWVo2wie-aHmf3roUcGKS5jS4RNZAjiaCn01epfG0YAwHdte23nrTbrJtl7OPYGPp2AKeMQxK2-dHm_278yDrZzqr3kguZj2utsEchzWTSSKbR8THOdgcx5IabdNhYDBvHt8VUcnbI2QIFEzn4DLstxnSLSkANHVo2Ud10k5IJBNStMuz7cZ8U7812KCT1UarI6STW9cuXmEmr_4PCchf65JAjKVtz2nWjvXG7sbj4ZgcBZoQYpV-QAIs8TM"
            alt={t("User Profile") as string}
            size="sm"
            className="cursor-pointer hover:ring-2 hover:ring-primary/50"
          />
        </Link>
      </div>
    </header>
  );
}
