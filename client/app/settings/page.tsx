"use client";

import React, { useState, useEffect } from "react";
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
import { useAuthStore } from "@/stores/authStore";
import { authService } from "@/services/auth.service";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const { user, setUser } = useAuthStore();
  const { update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [picture, setPicture] = useState<string | null>(null);

  // Initialize values when user is loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      if ('picture' in user) {
        setPicture((user as any).picture || null);
      } else if (user.image) {
        setPicture(user.image);
      }
      setBio((user as any).bio || "");
    }
  }, [user]);

  // Fetch the latest profile from backend on mount to ensure we have the freshest data (e.g. picture)
  useEffect(() => {
    let mounted = true;
    const fetchLatestProfile = async () => {
      try {
        const response: any = await authService.getMe();
        if (mounted && response?.user) {
          const freshUser = response.user;
          // Update local state
          setName(freshUser.name || "");
          setEmail(freshUser.email || "");
          setPicture(freshUser.picture || null);
          setBio(freshUser.bio || "");

          // Sync the global store and NextAuth session only if there's a difference
          // This prevents an infinite loop where `update` causes RouteGuard to unmount and remount this page
          if (user) {
            const currentImage = user.image || null;
            const freshImage = freshUser.picture || null;
            const currentBio = (user as any).bio || null;
            const freshBio = freshUser.bio || null;
            
            if (user.name !== freshUser.name || currentImage !== freshImage || currentBio !== freshBio) {
              setUser({
                ...user,
                name: freshUser.name,
                image: freshImage,
                bio: freshBio,
              });
              await update({ user: { name: freshUser.name, image: freshImage } });
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch fresh profile data:", err);
      }
    };

    if (user) {
      fetchLatestProfile();
    }
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleProfileSave = async () => {
    try {
      const fullName = name.trim();
      if (!fullName) {
        alert(t("Name cannot be empty"));
        return;
      }
      const response = await authService.updateProfile({ 
        name: fullName, 
        picture: picture || undefined,
        bio: bio || "",
      });
      if (response && user) {
        setUser({
          ...user,
          name: fullName,
          image: response.user?.picture || picture,
          bio: response.user?.bio || bio || null,
        });
        
        // Update NextAuth session to keep it in sync
        await update({ user: { name: fullName, image: response.user.picture || picture } });
        
        Swal.fire({
          title: t("Success!"),
          text: t("Profile updated successfully!"),
          icon: "success",
          confirmButtonColor: "var(--color-primary, #0066FF)",
        });
      }
    } catch (err: any) {
      console.error(err);
      alert(t("Failed to update profile: ") + (err.response?.data?.error || err.message));
    }
  };

  const handleProfileCancel = () => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio((user as any).bio || "");
      if ('picture' in user) {
        setPicture((user as any).picture || null);
      } else if (user.image) {
        setPicture(user.image);
      }
    }
  };

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
                onSave={handleProfileSave}
                onCancel={handleProfileCancel}
              >
                <ProfileSettingsForm
                  name={name}
                  setName={setName}
                  email={email}
                  bio={bio}
                  setBio={setBio}
                  picture={picture}
                  setPicture={setPicture}
                />
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
