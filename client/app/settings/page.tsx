"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsSectionWrapper } from "@/components/settings/SettingsSectionWrapper";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { WorkspacePreferences } from "@/components/settings/WorkspacePreferences";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="bg-background text-on-background font-body-lg min-h-screen flex antialiased">
      <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <PageWrapper>
        <header className="mb-xl">
          <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight mb-xs">
            {t("Settings")}
          </h2>
          <p className="font-body-lg text-body-lg text-secondary">
            {t("Manage your account preferences and workspace configuration.")}
          </p>
        </header>

        <div className="flex gap-xl relative items-start">
          <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          
          <div className="flex-1 max-w-3xl flex flex-col gap-xl pb-xl">
            {/* We just show all sections and let the user scroll or navigate,
                or we can render them conditionally based on `activeSection`.
                The original HTML seemed to just show them stacked.
                I'll keep them stacked and use IDs for navigation as per HTML design. */}
                
            <SettingsSectionWrapper
              id="profile"
              title={t("Profile Settings")}
              description={t("Update your personal information and how others see you on the platform.")}
            >
              <ProfileSettingsForm />
            </SettingsSectionWrapper>

            <SettingsSectionWrapper
              id="workspace"
              title={t("Workspace Preferences")}
              description={t("Manage organizational settings and defaults.")}
            >
              <WorkspacePreferences />
            </SettingsSectionWrapper>
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
