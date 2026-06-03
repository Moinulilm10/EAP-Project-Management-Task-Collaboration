"use client";

import React from "react";
import { Card } from "../ui/Card";
import { useTranslation } from "react-i18next";

export function TaskChart() {
  const { t } = useTranslation();

  const data = [
    { label: "To Do", value: 12, max: 40, color: "bg-secondary/40" },
    { label: "In Progress", value: 18, max: 40, color: "bg-primary" },
    { label: "In Review", value: 6, max: 40, color: "bg-primary-fixed-dim" },
    { label: "Completed", value: 32, max: 40, color: "bg-tertiary-container" },
    { label: "On Hold", value: 4, max: 40, color: "bg-error/60" },
  ];

  return (
    <Card className="p-md h-full min-h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-lg">
        <h3 className="font-title-md text-title-md text-on-surface">
          {t("Task Status Distribution")}
        </h3>
        <span className="font-label-sm text-label-sm text-secondary">
          {t("Updated just now")}
        </span>
      </div>
      
      {/* Y-axis grid helper */}
      <div className="flex-1 flex flex-col justify-between relative h-[200px] mb-xs">
        {/* Horizontal background grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          <div className="w-full border-t border-outline-variant/10"></div>
          <div className="w-full border-t border-outline-variant/10"></div>
          <div className="w-full border-t border-outline-variant/10"></div>
          <div className="w-full border-t border-outline-variant/10"></div>
          <div className="w-full border-t border-outline-variant/20"></div>
        </div>

        {/* Bars Container */}
        <div className="flex-1 flex items-end justify-between px-md gap-md pb-1 relative z-10">
          {data.map((item, idx) => {
            const heightPct = `${(item.value / item.max) * 100}%`;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end relative">
                {/* Tooltip */}
                <div className="absolute bottom-[calc(100%+8px)] opacity-0 group-hover:opacity-100 transition-opacity bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                  {item.value} {t("Tasks")}
                </div>
                
                {/* Bar element */}
                <div
                  className={`w-full max-w-[48px] rounded-t-lg transition-all duration-700 ease-out hover:scale-y-[1.03] origin-bottom cursor-pointer hover:shadow-lg ${item.color}`}
                  style={{ height: heightPct }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-axis Labels */}
      <div className="flex justify-between px-md pt-xs text-center border-t border-outline-variant/20">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-[11px] font-label-sm text-secondary truncate px-1">
            {t(item.label)}
          </div>
        ))}
      </div>
    </Card>
  );
}
