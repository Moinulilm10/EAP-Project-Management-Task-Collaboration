import React from "react";
import { useTranslation } from "react-i18next";

interface SettingsSidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  const { t } = useTranslation();

  const sections = [
    { id: "profile", label: t("Profile Settings") },
    { id: "workspace", label: t("Workspace Preferences") },
    { id: "notifications", label: t("Notification Settings") },
    { id: "appearance", label: t("Appearance") },
  ];

  return (
    <aside className="w-64 shrink-0 sticky top-[104px]">
      <nav className="flex flex-col gap-xs">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`px-md py-sm rounded-lg font-title-md text-title-sm transition-colors flex items-center justify-between group cursor-pointer ${isActive
                  ? "bg-surface-container-high/50 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high/30 hover:text-on-surface"
                }`}
            >
              {section.label}
              <span
                className={`material-symbols-outlined text-[18px] transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
              >
                chevron_right
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
