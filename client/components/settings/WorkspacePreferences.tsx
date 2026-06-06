import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { useTranslation } from "react-i18next";

export function WorkspacePreferences() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex flex-col gap-sm">
        <h3 className="font-title-md text-title-md text-on-surface">{t("General Info")}</h3>
        <div className="flex flex-col gap-xs mt-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">
            {t("Workspace Name")}
          </label>
          <Input defaultValue="Acme Corp Design Team" />
        </div>
        <div className="flex flex-col gap-xs mt-sm">
          <label className="font-label-md text-label-md text-on-surface-variant">
            {t("Default Timezone")}
          </label>
          <Select
            options={[
              { label: t("Pacific Time (US & Canada)"), value: "PT" },
              { label: t("Eastern Time (US & Canada)"), value: "ET" },
              { label: t("Coordinated Universal Time (UTC)"), value: "UTC" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Project Defaults")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Settings applied to all newly created projects in this workspace.")}
        </p>
        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-label-md text-on-surface-variant">
            {t("Default Privacy")}
          </label>
          <Select
            options={[
              { label: t("Public (Visible to all workspace members)"), value: "public" },
              { label: t("Private (Invite only)"), value: "private" },
            ]}
          />
        </div>
        <div className="flex flex-col gap-xs mt-sm">
          <label className="font-label-md text-label-md text-on-surface-variant">
            {t("Task Status Workflow")}
          </label>
          <Select
            options={[
              { label: t("Simple (To Do, In Progress, Done)"), value: "simple" },
              { label: t("Agile (Backlog, To Do, In Progress, Review, Done)"), value: "agile" },
              { label: t("Custom"), value: "custom" },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-sm">
        <h3 className="font-title-md text-title-md text-on-surface">{t("Working Days & Hours")}</h3>
        <p className="font-body-sm text-body-sm text-secondary mb-xs">
          {t("Used for accurate task estimation and capacity planning.")}
        </p>
        <div className="flex gap-sm">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
             <button 
                key={idx} 
                className={`w-10 h-10 rounded-full font-label-md flex items-center justify-center transition-colors ${idx < 5 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
             >
                {day}
             </button>
          ))}
        </div>
        <div className="flex items-center gap-md mt-sm">
           <div className="flex flex-col gap-xs flex-1">
             <label className="font-label-sm text-label-sm text-on-surface-variant">{t("Start Time")}</label>
             <Input type="time" defaultValue="09:00" />
           </div>
           <div className="flex flex-col gap-xs flex-1">
             <label className="font-label-sm text-label-sm text-on-surface-variant">{t("End Time")}</label>
             <Input type="time" defaultValue="17:00" />
           </div>
        </div>
      </div>
    </div>
  );
}
