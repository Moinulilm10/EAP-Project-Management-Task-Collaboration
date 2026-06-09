"use client";

import React from "react";
import { Card } from "../ui/Card";
import { useTranslation } from "react-i18next";
import { MdCheckCircle, MdUpdate, MdChat, MdHistory } from "react-icons/md";
import { RecentActivityItem } from "../../services/dashboard.service";

interface ActivityTimelineProps {
  activities: RecentActivityItem[];
  isLoading?: boolean;
}

export function ActivityTimeline({ activities = [], isLoading = false }: ActivityTimelineProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-md h-fit min-h-[550px] flex flex-col">
      <div className="flex justify-between items-center mb-md">
        <h3 className="font-title-md text-title-md text-on-surface">
          {t("Recent Activity Timeline")}
        </h3>
        <span className="font-label-sm text-label-sm text-secondary cursor-pointer hover:text-primary transition-colors">
          {t("View Log")}
        </span>
      </div>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center py-xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-lg">
          <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary mb-3">
            <MdHistory className="w-6 h-6 text-secondary/70" />
          </div>
          <p className="font-body-md text-secondary font-medium">
            {t("No recent activities")}
          </p>
          <p className="font-label-sm text-secondary/60 mt-1 max-w-[200px]">
            {t("Actions performed in the system will appear here.")}
          </p>
        </div>
      ) : (
        <div className="relative pl-sm flex-grow flex flex-col gap-6 overflow-y-auto pr-1 mt-md">
          {/* Vertical Line */}
          <div className="absolute left-[20px] top-6 bottom-6 w-0.5 bg-outline-variant/20 pointer-events-none" />

          {activities.map((activity) => {
            const isCompleted = activity.status === "done";
            const icon = isCompleted ? <MdCheckCircle className="text-[18px]" /> : <MdUpdate className="text-[18px]" />;
            const iconBg = isCompleted ? "bg-tertiary-container/10" : "bg-secondary-container/30";
            const iconColor = isCompleted ? "text-tertiary-container" : "text-on-secondary-container";

            // Format time string to "X hours ago" or similar
            const diff = Date.now() - new Date(activity.time).getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(hours / 24);
            const mins = Math.floor(diff / (1000 * 60));

            let timeStr = "just now";
            if (days > 0) timeStr = `${days}d ago`;
            else if (hours > 0) timeStr = `${hours}h ago`;
            else if (mins > 0) timeStr = `${mins}m ago`;

            return (
              <div key={activity.id} className="relative flex gap-sm items-start z-10">
                {/* Timeline Icon Badge */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${iconBg} ${iconColor}`}
                >
                  {icon}
                </div>

                {/* Content block */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-xs">
                    <p className="font-body-md text-body-md text-on-surface">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {t(activity.action)}{" "}
                      <span className="font-semibold text-primary">{t(activity.target)}</span>
                    </p>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary block mt-0.5">
                    {timeStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
