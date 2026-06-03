import React from "react";
import { Card } from "../ui/Card";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconColorClass?: string; // e.g. text-on-tertiary-container
  iconBgClass?: string; // e.g. bg-on-tertiary-container/20
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    label?: string; // For things like "Same as last month"
  };
  subtitle?: string; // e.g. "days" or "tasks/wk"
  customDecorative?: React.ReactNode;
}

export function KpiCard({
  title,
  value,
  icon,
  iconColorClass = "text-primary",
  iconBgClass = "bg-primary-container/20",
  trend,
  subtitle,
  customDecorative,
}: KpiCardProps) {
  return (
    <Card className="justify-between h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-sm z-10">
        <h3 className="font-label-md text-label-md text-secondary">{title}</h3>
        <div className={`${iconBgClass} ${iconColorClass} p-xs rounded`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-sm z-10">
        <span className="font-display-lg text-display-lg text-on-surface">
          {value}
        </span>
        {subtitle && (
          <span className="font-title-md text-title-md text-secondary">
            {subtitle}
          </span>
        )}
        {trend && (
          <span
            className={`font-label-sm text-label-sm px-xs py-[2px] rounded flex items-center gap-[2px] ${
              trend.direction === "up"
                ? "text-tertiary bg-tertiary-container/10"
                : trend.direction === "down"
                ? "text-error bg-error-container/30"
                : "text-secondary bg-surface-container-high"
            }`}
          >
            {trend.direction !== "neutral" && (
              <span className="material-symbols-outlined text-[12px]">
                {trend.direction === "up" ? "trending_up" : "trending_down"}
              </span>
            )}
            {trend.value}
          </span>
        )}
      </div>
      {customDecorative}
    </Card>
  );
}
