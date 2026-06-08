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
      {/* Actions overlay on hover */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-surface-container-lowest/90 dark:bg-surface-container-low/90 backdrop-blur-sm p-1 rounded-xl border border-outline-variant/30 shadow-sm z-10">
        {onOpenDetails && (
          <button
            type="button"
            onClick={onOpenDetails}
            className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-surface-container-high transition-colors"
            aria-label={t("View Details") as string}
          >
            <MdOpenInNew className="w-[18px] h-[18px]" />
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(project.id)}
            className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-surface-container-high transition-colors"
            aria-label={t("Edit Project") as string}
          >
            <MdEdit className="w-[18px] h-[18px]" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(project.id)}
            className="p-1.5 text-secondary hover:text-error rounded-lg hover:bg-error-container/20 transition-colors"
            aria-label={t("Delete Project") as string}
          >
            <MdDelete className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>

      {/* Badges Row */}
      <div className="flex flex-col gap-2 mb-sm pr-16">
        {/* Row 1: Status and Member Count */}
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
        </div>

        {/* Row 2: Admin Badge */}
        {isAdmin && (
          <div className="flex">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase text-primary border border-primary/20">
              {t("Admin")}
            </span>
          </div>
        )}
      </div>

      <h3 className="font-title-md text-title-md text-on-surface mb-xs">
        {t(project.title)}
      </h3>

      <p className="font-body-md text-body-md text-secondary line-clamp-2 mb-md">
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
