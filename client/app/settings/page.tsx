"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsSectionWrapper } from "@/components/settings/SettingsSectionWrapper";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { WorkspacePreferences } from "@/components/settings/WorkspacePreferences";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
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
            {activeSection === "profile" && (
              <SettingsSectionWrapper
                id="profile"
                title={t("Profile Settings")}
                description={t("Update your personal information and how others see you on the platform.")}
              >
                <ProfileSettingsForm />
              </SettingsSectionWrapper>
            )}

            {activeSection === "workspace" && (
              <SettingsSectionWrapper
                id="workspace"
                title={t("Workspace Preferences")}
                description={t("Manage organizational settings and defaults.")}
              >
                <WorkspacePreferences />
              </SettingsSectionWrapper>
            )}

            {activeSection === "notifications" && (
              <SettingsSectionWrapper
                id="notifications"
                title={t("Notification Settings")}
                description={t("Control how and when you want to be notified.")}
              >
                <NotificationSettings />
              </SettingsSectionWrapper>
            )}

            {activeSection === "appearance" && (
              <SettingsSectionWrapper
                id="appearance"
                title={t("Appearance")}
                description={t("Customize the look and feel of your workspace.")}
              >
                <AppearanceSettings />
              </SettingsSectionWrapper>
            )}

            {activeSection === "security" && (
              <SettingsSectionWrapper
                id="security"
                title={t("Security & Privacy")}
                description={t("Manage your password and secure your account.")}
              >
                <SecuritySettings />
              </SettingsSectionWrapper>
            )}

            {activeSection === "integrations" && (
              <SettingsSectionWrapper
                id="integrations"
                title={t("Integrations")}
                description={t("Connect your workspace with the tools you use every day.")}
              >
                <IntegrationSettings />
              </SettingsSectionWrapper>
            )}
          </div>
        </div>
      </PageWrapper>
    </div>
  );
}
