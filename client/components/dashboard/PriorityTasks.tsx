"use client";

import React from "react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { useTranslation } from "react-i18next";

interface TaskItem {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  isOverdue?: boolean;
  assigneeInitials: string;
  assigneeBg: string;
}

export function PriorityTasks() {
  const { t } = useTranslation();

  const tasks: TaskItem[] = [
    {
      id: "t1",
      title: "Review portal prototype feedback",
      project: "Client Portal Redesign",
      dueDate: "Today",
      priority: "high",
      isOverdue: true,
      assigneeInitials: "JD",
      assigneeBg: "bg-primary-fixed text-on-primary-fixed",
    },
    {
      id: "t2",
      title: "Launch landing page assets",
      project: "Q3 Marketing Campaign",
      dueDate: "Oct 10",
      priority: "high",
      assigneeInitials: "AM",
      assigneeBg: "bg-secondary-container text-on-secondary-container",
    },
    {
      id: "t3",
      title: "Final security audit check",
      project: "Server Migration V2",
      dueDate: "Completed",
      priority: "medium",
      assigneeInitials: "SK",
      assigneeBg: "bg-tertiary-fixed text-on-tertiary-fixed",
    },
  ];

  return (
    <Card className="p-md h-full min-h-[350px] flex flex-col">
      <div className="flex justify-between items-center mb-md">
        <h3 className="font-title-md text-title-md text-on-surface">
          {t("High Priority Tasks")}
        </h3>
        <span className="font-label-sm text-label-sm text-secondary">
          {t("See All Tasks")}
        </span>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-sm rounded-lg hover:bg-surface-container-low transition-colors duration-200 border border-outline-variant/10"
          >
            <div className="flex items-center gap-sm min-w-0">
              {/* Assignee Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] flex-shrink-0 ${task.assigneeBg}`}
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
                {t(task.dueDate)}
              </span>
              <Badge variant={task.priority === "high" ? "on-hold" : "completed"}>
                {t(task.priority.toUpperCase())}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
