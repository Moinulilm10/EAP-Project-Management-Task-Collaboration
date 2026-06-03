"use client";

import React, { useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Button } from "../../components/ui/Button";
import { ProjectCard, Project } from "../../components/projects/ProjectCard";
import { useTranslation } from "react-i18next";
import { MdFilterList, MdAdd, MdFolderOpen } from "react-icons/md";
import "../../i18n";

const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Q3 Marketing Campaign",
    description: "Executing the multi-channel marketing strategy for the new product launch across digital platforms.",
    status: "active",
    dueDate: "Oct 15",
    progress: 80,
  },
  {
    id: "2",
    title: "Client Portal Redesign",
    description: "Overhauling the user interface and experience for the primary enterprise client dashboard.",
    status: "active",
    dueDate: "Tomorrow",
    progress: 92,
    isWarning: true,
  },
  {
    id: "3",
    title: "Server Migration V2",
    description: "Migrated legacy databases to the new cloud infrastructure with zero downtime.",
    status: "completed",
    dueDate: "Sep 01",
    progress: 100,
  },
];

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const handleEdit = (id: string) => {
    console.log(`Edit project ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Delete project ${id}`);
  };

  const filteredProjects = MOCK_PROJECTS.filter((project) => {
    if (statusFilter === "All Statuses") return true;
    if (statusFilter === "Active") return project.status === "active";
    if (statusFilter === "Completed") return project.status === "completed";
    if (statusFilter === "On Hold") return project.status === "on-hold";
    return true;
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {t("All Projects")}
          </h2>
          <p className="font-body-md text-body-md text-secondary mt-xs">
            {t("Manage and track your team's ongoing initiatives.")}
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative flex-1 md:w-64">
            <MdFilterList className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] w-[18px] h-[18px]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-body-md focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
            >
              <option>{t("All Statuses")}</option>
              <option>{t("Active")}</option>
              <option>{t("Completed")}</option>
              <option>{t("On Hold")}</option>
            </select>
          </div>
          <Button variant="primary" className="whitespace-nowrap flex items-center gap-1">
            <MdAdd className="w-[18px] h-[18px]" />
            {t("New Project")}
          </Button>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-xl border-2 border-dashed border-outline-variant/30 rounded-xl bg-surface-container-lowest/50">
          <MdFolderOpen className="text-[48px] text-secondary mb-sm w-12 h-12" />
          <p className="font-title-md text-secondary">{t("No projects found matching the filter")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
