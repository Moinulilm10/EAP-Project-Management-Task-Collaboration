"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { IconButton } from "../ui/IconButton";
import { Avatar } from "../ui/Avatar";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdMenu,
  MdAdd,
  MdSearch,
  MdNotifications,
  MdDarkMode,
  MdLightMode,
  MdPerson,
  MdSettings,
  MdLogout,
  MdShield
} from "react-icons/md";
import "../../i18n";

interface TopNavBarProps {
  onMenuClick?: () => void;
}

export function TopNavBar({ onMenuClick }: TopNavBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, clearAuth } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true);

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    clearAuth();
    await signOut({ callbackUrl: "/login" });
  };

  // Helper to format role names
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "project_manager":
        return "Project Manager";
      case "team_member":
        return "Team Member";
      default:
        return "User";
    }
  };

  // Helper to get role colors for badge
  const getRoleBadgeClass = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-error-container/20 text-error border border-error/30";
      case "project_manager":
        return "bg-primary-container/20 text-primary border border-primary/30";
      default:
        return "bg-secondary-container/20 text-secondary border border-secondary/30";
    }
  };

  return (
    <header className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop ml-auto">
      {/* Mobile brand and menu trigger */}
      <div className="flex items-center gap-sm md:hidden">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="text-on-surface-variant hover:text-primary p-1 rounded-md hover:bg-surface-container-high/40 transition-colors flex items-center justify-center cursor-pointer"
            aria-label={t("menu") as string}
          >
            <MdMenu className="w-6 h-6" />
          </button>
        )}
        <Link href="/" className="font-headline-md text-headline-md font-black text-primary">
          {t("ProjectFlow")}
        </Link>
      </div>

      {/* Desktop Search */}
      <div className="hidden md:flex items-center w-96 relative">
        <Input
          icon={<MdSearch className="w-5 h-5 text-on-surface-variant/60" />}
          placeholder={t("Search workspace...") as string}
        />
      </div>

      <div className="flex items-center gap-md">
        <Button className="hidden md:flex items-center gap-1 cursor-pointer" onClick={() => router.push('/tasks')}>
          <MdAdd className="w-[18px] h-[18px]" />
          {t("Create Task")}
        </Button>

        <div className="flex items-center gap-xs">
          <IconButton
            icon={<MdNotifications className="w-5 h-5" />}
            aria-label={t("notifications") as string}
          />
          <IconButton
            icon={
              mounted && resolvedTheme === "dark" ? (
                <MdLightMode className="w-5 h-5" />
              ) : (
                <MdDarkMode className="w-5 h-5" />
              )
            }
            onClick={toggleTheme}
            aria-label={t("toggle theme") as string}
          />
        </div>

        <div className="h-8 w-px bg-outline-variant/40 mx-xs hidden lg:block"></div>

        {/* User profile section & dropdown container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full p-0.5 cursor-pointer group"
            aria-label="User profile menu"
            aria-expanded={isDropdownOpen}
          >
            <Avatar
              src={user?.image}
              name={user?.name || "User"}
              alt={user?.name || "User Profile"}
              size="sm"
              className="cursor-pointer  group-hover:ring-primary/50 transition-all"
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 mt-sm w-72 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl z-50 overflow-hidden"
              >
                {/* Header user info block */}
                <div className="px-5 py-4 bg-surface-container-low border-b border-outline-variant/20 flex flex-col items-center text-center">
                  <Avatar
                    src={user?.image}
                    name={user?.name || "User"}
                    size="md"
                    className="mb-sm"
                  />
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold truncate w-full max-w-[240px]">
                    {user?.name || "Anonymous User"}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate w-full max-w-[240px] mb-xs">
                    {user?.email || "no-email@projectflow.com"}
                  </p>

                  {/* Role Badge */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-label-sm font-medium ${getRoleBadgeClass(user?.role)}`}>
                    <MdShield className="w-3.5 h-3.5 mr-1" />
                    {getRoleLabel(user?.role)}
                  </span>
                </div>

                {/* Dropdown Menu Links */}
                <div className="p-xs">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/settings");
                    }}
                    className="w-full flex items-center gap-sm px-sm py-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 rounded-xl font-label-md text-label-md transition-colors cursor-pointer text-left"
                  >
                    <MdPerson className="w-5 h-5 text-secondary" />
                    {t("My Profile")}
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/settings");
                    }}
                    className="w-full flex items-center gap-sm px-sm py-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 rounded-xl font-label-md text-label-md transition-colors cursor-pointer text-left"
                  >
                    <MdSettings className="w-5 h-5 text-secondary" />
                    {t("Settings")}
                  </button>

                  <div className="h-px bg-outline-variant/30 my-xs" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-sm px-sm py-sm text-error hover:bg-error/10 rounded-xl font-label-md text-label-md transition-colors cursor-pointer text-left"
                  >
                    <MdLogout className="w-5 h-5" />
                    {t("Log Out")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

