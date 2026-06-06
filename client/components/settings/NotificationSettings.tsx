import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "../ui/Select";

export function NotificationSettings() {
  const { t } = useTranslation();
  const [dndDuration, setDndDuration] = useState("off");

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Email Notifications")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Choose what events you want to be notified about via email.")}
        </p>
        
        <div className="flex items-center justify-between py-sm border-b border-outline-variant/10">
          <div>
            <div className="font-label-md text-label-md text-on-surface">{t("Mentions and Replies")}</div>
            <div className="font-body-sm text-body-sm text-secondary">{t("When someone mentions you or replies to your comment.")}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-sm border-b border-outline-variant/10">
          <div>
            <div className="font-label-md text-label-md text-on-surface">{t("Task Updates")}</div>
            <div className="font-body-sm text-body-sm text-secondary">{t("When a task assigned to you changes status.")}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between py-sm border-b border-outline-variant/10">
          <div>
            <div className="font-label-md text-label-md text-on-surface">{t("Daily Digest")}</div>
            <div className="font-body-sm text-body-sm text-secondary">{t("Receive a daily summary of your tasks and activities.")}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-sm mt-md">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Push Notifications")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Get instant updates directly in your browser or desktop app.")}
        </p>
        
        <div className="flex items-center justify-between py-sm border-b border-outline-variant/10">
          <div>
            <div className="font-label-md text-label-md text-on-surface">{t("Direct Messages")}</div>
            <div className="font-body-sm text-body-sm text-secondary">{t("When someone sends you a direct message.")}</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
      
      <div className="flex flex-col gap-sm mt-md">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Do Not Disturb")}</h3>
        <div className="flex items-center justify-between py-sm border-b border-outline-variant/10">
          <div>
            <div className="font-label-md text-label-md text-on-surface">{t("Pause all notifications")}</div>
            <div className="font-body-sm text-body-sm text-secondary">{t("Temporarily mute notifications for a specific duration.")}</div>
          </div>
          <Select
            value={dndDuration}
            onChange={(e) => setDndDuration(e.target.value)}
            options={[
              { label: t("Off"), value: "off" },
              { label: t("For 1 hour"), value: "1h" },
              { label: t("For 4 hours"), value: "4h" },
              { label: t("Until tomorrow"), value: "tomorrow" },
            ]}
            className="w-48"
            direction="up"
          />
        </div>
      </div>
    </div>
  );
}
