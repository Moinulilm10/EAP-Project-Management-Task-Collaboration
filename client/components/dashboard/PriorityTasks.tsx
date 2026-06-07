"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useTranslation } from "react-i18next";
import { TaskPriorityItem } from "../../services/dashboard.service";

interface PriorityTasksProps {
  tasks: TaskPriorityItem[];
  upcoming: TaskPriorityItem[];
}

export function PriorityTasks({ tasks = [], upcoming = [] }: PriorityTasksProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"priority" | "upcoming">("priority");

  const displayList = tab === "priority" ? tasks : upcoming;

  return (
    <Card className="p-md h-full min-h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-md">
        <div className="flex gap-4">
          <h3 
            className={`font-title-md text-title-md cursor-pointer transition-colors ${tab === "priority" ? "text-on-surface" : "text-secondary"}`}
            onClick={() => setTab("priority")}
          >
            {t("High Priority")}
          </h3>
          <h3 
            className={`font-title-md text-title-md cursor-pointer transition-colors ${tab === "upcoming" ? "text-on-surface" : "text-secondary"}`}
            onClick={() => setTab("upcoming")}
          >
            {t("Upcoming Deadlines")}
          </h3>
        </div>
        <Link href="/tasks" className="font-label-sm text-label-sm text-primary hover:text-primary/70 cursor-pointer transition-colors">
          {t("See All Tasks")}
        </Link>
      </div>

      {displayList.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-secondary font-body-md">
          {t(tab === "priority" ? "No high priority tasks." : "No upcoming deadlines.")}
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col justify-center">
          {displayList.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-low transition-colors duration-200 border border-outline-variant/10 cursor-pointer"
            >
            <div className="flex items-center gap-sm min-w-0">
              {/* Assignee Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] flex-shrink-0 bg-primary-fixed text-on-primary-fixed`}
              >
                {task.assigneeInitials}
              </div>

              {/* Task Details */}
              <div className="min-w-0">
                <h4 className="font-body-md text-body-md font-semibold text-on-surface truncate">
                  {t(task.title)}
                </h4>
                <p className="font-label-sm text-label-sm text-secondary truncate">
                  {t(task.project)}
                </p>
              </div>
            </div>

            {/* Badges & Date */}
            <div className="flex items-center gap-sm flex-shrink-0 pl-sm">
              <span
                className={`font-label-sm text-label-sm ${
                  task.isOverdue ? "text-error font-bold" : "text-secondary"
                }`}
              >
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
              </span>
              <Badge variant={task.priority === "high" || task.priority === "critical" ? "on-hold" : "completed"}>
                {t(task.priority.toUpperCase())}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      )}
    </Card>
  );
}
