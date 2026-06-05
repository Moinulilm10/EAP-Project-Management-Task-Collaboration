"use client";

import { useTranslation } from "react-i18next";
import {
  MdCalendarToday,
  MdCheckCircle,
  MdDelete,
  MdEdit,
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
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { t } = useTranslation();
  const isCompleted = project.status === "completed";
  const normalizedStatus =
    project.status === "on_hold" ? "on-hold" : project.status;

  return (
    <Card className={isCompleted ? "opacity-75 hover:opacity-100" : ""}>
      <div className="flex justify-between items-start mb-sm">
        <Badge variant={normalizedStatus}>
          {t(
            normalizedStatus === "active"
              ? "Active"
              : normalizedStatus === "completed"
                ? "Completed"
                : "On Hold",
          )}
        </Badge>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
          {onEdit && (
            <button
              onClick={() => onEdit(project.id)}
              className="p-1 text-secondary hover:text-primary rounded hover:bg-surface-container-high transition-colors flex items-center justify-center"
              aria-label={t("Edit Project") as string}
            >
              <MdEdit className="w-4.5 h-4.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="p-1 text-secondary hover:text-error rounded hover:bg-error-container/50 transition-colors flex items-center justify-center"
              aria-label={t("Delete Project") as string}
            >
              <MdDelete className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      <h3 className="font-title-md text-title-md text-on-surface mb-xs">
        {t(project.title)}
      </h3>

      <div className="flex items-center gap-2 text-label-sm text-secondary mb-2">
        {project.memberCount !== undefined && (
          <span className="px-2 py-1 rounded-full bg-surface-container-low text-on-surface">
            {`${project.memberCount} members`}
          </span>
        )}
      </div>

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
