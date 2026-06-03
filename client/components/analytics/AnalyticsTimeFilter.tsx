import React from "react";
import { useTranslation } from "react-i18next";

export function AnalyticsTimeFilter() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-sm bg-surface-container-low p-xs rounded-lg border border-outline-variant/30">
      <button className="px-sm py-xs rounded text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors">
        {t("7D")}
      </button>
      <button className="px-sm py-xs rounded bg-surface-container-lowest text-primary shadow-sm font-label-md text-label-md">
        {t("30D")}
      </button>
      <button className="px-sm py-xs rounded text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors">
        {t("3M")}
      </button>
      <button className="px-sm py-xs rounded text-secondary font-label-md text-label-md hover:bg-surface-container-high transition-colors flex items-center gap-xs">
        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
        {t("Custom")}
      </button>
    </div>
  );
}
