"use client";

import React from "react";
import { Card } from "../ui/Card";
import { useTranslation } from "react-i18next";
import { MdCheckCircle, MdUpdate, MdChat } from "react-icons/md";

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export function ActivityTimeline() {
  const { t } = useTranslation();

  const activities: ActivityItem[] = [
    {
      id: "a1",
      user: "John Doe",
      action: "completed the task",
      target: "Design portal high-fi mockups",
      time: "2h ago",
      icon: <MdCheckCircle className="text-[18px]" />,
      iconBg: "bg-tertiary-container/10",
      iconColor: "text-tertiary-container",
    },
    {
      id: "a2",
      user: "Sarah Connor",
      action: "updated status of",
      target: "Server Migration V2 to Completed",
      time: "5h ago",
      icon: <MdUpdate className="text-[18px]" />,
      iconBg: "bg-secondary-container/30",
      iconColor: "text-on-secondary-container",
    },
    {
      id: "a3",
      user: "Alex Mercer",
      action: "added a new comment to",
      target: "Q3 Marketing Campaign",
      time: "1d ago",
      icon: <MdChat className="text-[18px]" />,
      iconBg: "bg-primary-fixed/30",
      iconColor: "text-primary",
    },
  ];

  return (
    <Card className="p-md h-full min-h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-md">
        <h3 className="font-title-md text-title-md text-on-surface">
          {t("Recent Activity Timeline")}
        </h3>
        <span className="font-label-sm text-label-sm text-secondary">
          {t("View Log")}
        </span>
      </div>

      <div className="relative pl-sm flex-grow flex flex-col justify-center gap-6">
        {/* Vertical Line */}
        <div className="absolute left-[20px] top-6 bottom-6 w-0.5 bg-outline-variant/20 pointer-events-none" />

        {activities.map((activity) => (
          <div key={activity.id} className="relative flex gap-sm items-start z-10">
            {/* Timeline Icon Badge */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${activity.iconBg} ${activity.iconColor}`}
            >
              {activity.icon}
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
                {t(activity.time)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
