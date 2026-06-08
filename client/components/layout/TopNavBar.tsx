"use client";

import { useAuthStore } from "@/stores/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdAdd,
  MdDarkMode,
  MdLightMode,
  MdLogout,
  MdMenu,
  MdNotifications,
  MdPerson,
  MdSearch,
  MdSettings,

} from "react-icons/md";
import "../../i18n";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { IconButton } from "../ui/IconButton";
import { Input } from "../ui/Input";

interface TopNavBarProps {
  onMenuClick?: () => void;
}

export function TopNavBar({ onMenuClick }: TopNavBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, clearAuth, setLoading } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    // Defer mounting to the next animation frame to avoid synchronous setState in effect
    let raf = 0 as number;
    raf = requestAnimationFrame(() => setMounted(true));

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    // Show the app loading state immediately to avoid a white flash
    setLoading(true);

    // Use client-side signOut (no full-page redirect) and then navigate
    await signOut({ redirect: false });

    // Clear local auth and navigate to login client-side
    clearAuth();
    router.push("/login");
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
        <Link
          href="/"
          className="font-headline-md text-headline-md font-black text-primary"
        >
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
        <Button
          className="hidden md:flex items-center gap-1 cursor-pointer"
          onClick={() => router.push("/tasks")}
        >
          <MdAdd className="w-4.5 h-4.5" />
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
              priority
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
                    priority
                  />
                  <h4 className="font-title-md text-title-md text-on-surface font-semibold truncate w-full max-w-60">
                    {user?.name || "Anonymous User"}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate w-full max-w-60 mb-xs">
                    {user?.email || "no-email@projectflow.com"}
                  </p>


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
