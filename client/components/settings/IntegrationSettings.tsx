import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";

export function IntegrationSettings() {
  const { t } = useTranslation();

  const integrations = [
    {
      id: "github",
      name: "GitHub",
      description: "Link pull requests and commits to tasks automatically.",
      icon: "🐙",
      connected: true,
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get notifications and create tasks directly from Slack.",
      icon: "💬",
      connected: false,
    },
    {
      id: "gdrive",
      name: "Google Drive",
      description: "Attach files and documents directly from your Drive.",
      icon: "📁",
      connected: false,
    },
    {
      id: "figma",
      name: "Figma",
      description: "Embed live designs into task descriptions.",
      icon: "🎨",
      connected: false,
    }
  ];

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col gap-sm">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Connected Apps")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Connect your workspace with the tools you use every day.")}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-sm">
          {integrations.map((app) => (
            <div key={app.id} className="border border-outline-variant/30 rounded-xl p-md bg-surface-container-lowest flex flex-col h-full hover:border-primary/50 transition-colors">
               <div className="flex items-center justify-between mb-sm">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-2xl">
                     {app.icon}
                  </div>
                  {app.connected ? (
                    <span className="bg-success/10 text-success px-2 py-1 rounded text-xs font-medium">{t("Connected")}</span>
                  ) : null}
               </div>
               <h4 className="font-label-lg text-label-lg text-on-surface mb-1">{app.name}</h4>
               <p className="font-body-sm text-body-sm text-secondary flex-1 mb-md">{app.description}</p>
               
               <div>
                  {app.connected ? (
                     <Button variant="secondary" className="w-full text-error border-error/50 hover:bg-error/10">{t("Disconnect")}</Button>
                  ) : (
                     <Button variant="secondary" className="w-full">{t("Connect")}</Button>
                  )}
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
