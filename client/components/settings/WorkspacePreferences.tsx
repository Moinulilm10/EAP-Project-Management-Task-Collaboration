import React from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { useTranslation } from "react-i18next";

export function WorkspacePreferences() {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col gap-xs">
        <label className="font-label-md text-label-md text-on-surface-variant">
          {t("Workspace Name")}
        </label>
        <Input defaultValue="Acme Corp Design Team" />
      </div>
      <div className="flex flex-col gap-xs">
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
    </>
  );
}
