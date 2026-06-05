"use client";

import { useTranslation } from "react-i18next";
import {
  MdCalendarToday,
  MdCheckCircle,
  MdDelete,
  MdEdit,
  MdOpenInNew,
  MdWarning,
} from "react-icons/md";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "on_hold";
  dueDate: string;
  progress: number;
  memberCount?: number;
  isWarning?: boolean;
}

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
  onOpenDetails?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({
  project,
  isAdmin,
  onOpenDetails,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const { t } = useTranslation();
  const isCompleted = project.status === "completed";
  const normalizedStatus =
    project.status === "on_hold" ? "on-hold" : project.status;

  return (
    <Card
      className={`group ${isCompleted ? "opacity-75 hover:opacity-100" : ""}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={normalizedStatus}>
            {t(
              normalizedStatus === "active"
                ? "Active"
                : normalizedStatus === "completed"
                  ? "Completed"
                  : "On Hold",
            )}
          </Badge>
          {project.memberCount !== undefined && project.memberCount >= 0 && (
            <span className="rounded-full bg-surface-container-low px-3 py-1 text-[10px] font-semibold uppercase text-secondary">
              {`${project.memberCount} ${t("members")}`}
            </span>
          )}
          {isAdmin && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase text-primary border border-primary/20">
              {t("Admin")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onOpenDetails && (
            <button
              type="button"
              onClick={onOpenDetails}
              className="p-2 text-secondary hover:text-primary rounded-xl hover:bg-surface-container-high transition-colors"
              aria-label={t("View Details") as string}
            >
              <MdOpenInNew className="w-5 h-5" />
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(project.id)}
              className="p-2 text-secondary hover:text-primary rounded-xl hover:bg-surface-container-high transition-colors"
              aria-label={t("Edit Project") as string}
            >
              <MdEdit className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(project.id)}
              className="p-2 text-secondary hover:text-error rounded-xl hover:bg-error-container/20 transition-colors"
              aria-label={t("Delete Project") as string}
            >
              <MdDelete className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <h3 className="font-title-md text-title-md text-on-surface mb-xs">
        {t(project.title)}
      </h3>

      <p className="font-body-md text-body-md text-secondary line-clamp-2 mb-md flex-1">
        {t(project.description)}
      </p>

      <div className="mt-auto">
        <div className="flex justify-between items-center mb-xs font-label-sm text-label-sm">
          {project.isWarning ? (
            <span className="text-error flex items-center gap-xs font-bold">
              <MdWarning className="w-3.5 h-3.5" />
              {t(project.dueDate)}
            </span>
          ) : (
            <span className="text-secondary flex items-center gap-xs">
              {isCompleted ? (
                <MdCheckCircle className="w-3.5 h-3.5" />
              ) : (
                <MdCalendarToday className="w-3.5 h-3.5" />
              )}
              {t(project.dueDate)}
            </span>
          )}
          <span
            className={`${isCompleted ? "text-secondary" : "text-primary"} font-bold`}
          >
            {project.progress}%
          </span>
        </div>

        <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted ? "bg-secondary" : "bg-primary"
            }`}
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
}
