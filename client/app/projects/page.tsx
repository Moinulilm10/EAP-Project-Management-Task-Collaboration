"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdFilterList, MdFolderOpen } from "react-icons/md";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { ProjectCardSkeleton } from "../../components/projects/ProjectCardSkeleton";
import { ProjectDetailsModal } from "../../components/projects/ProjectDetailsModal";
import { ProjectModal } from "../../components/projects/ProjectModal";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import Pagination from "../../components/ui/Pagination";
import { useDebounce } from "../../hooks/useDebounce";
import "../../i18n";
import {
  ProjectCreateDTO,
  ProjectUpdateDTO,
} from "../../services/project.service";

import { useProjectStore } from "../../stores/projectStore";
import { notification } from "../../utils/notification";

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "On Hold", value: "on_hold" },
] as const;

const formatDueDate = (deadline: string | null) => {
  if (!deadline) return "No deadline";
  const date = new Date(deadline);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

type ProjectView = {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "on_hold";
  dueDate: string;
  rawDeadline: string | null;
  progress: number;
  memberCount?: number;
  isWarning?: boolean;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  canManage: boolean;
};

export default function ProjectsPage() {
  const { t } = useTranslation();
  const {
    projects,
    loading,
    total,
    page,
    limit,
    statusFilter,
    searchQuery,
    adminOnlyFilter,
    sortBy,
    deadlineStatus,
    setStatusFilter,
    setSearchQuery,
    setAdminOnlyFilter,
    setSortBy,
    setDeadlineStatus,
    setPage,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjectStore();


  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectView | null>(
    null,
  );
  const [selectedProject, setSelectedProject] = useState<ProjectView | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const debouncedSearch = useDebounce(localSearch, 400);

  // update store search only after debounce
  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects, statusFilter, adminOnlyFilter, searchQuery, page, sortBy, deadlineStatus]);

  const uiProjects = useMemo(
    () =>
      projects.map((project) => {
        const role = project.currentUserRole;
        const canManage = role === 'Admin' || role === 'Project Manager';
        return {
          id: project.id,
          title: project.name,
          description: project.description || "No description provided.",
          status: project.status,
          dueDate: formatDueDate(project.deadline),
          rawDeadline: project.deadline,
          progress: project.progress,
          memberCount: project.memberCount,
          isWarning:
            project.deadline !== null &&
            new Date(project.deadline) < new Date() &&
            project.status !== "completed",
          ownerId: project.owner.id,
          ownerName: project.owner.name,
          ownerEmail: project.owner.email,
          canManage,
        };
      }),
    [projects],
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between mb-8">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {t("All Projects")}
          </h2>
          <p className="font-body-md text-body-md text-secondary mt-2">
            {t("Manage and track your team's ongoing initiatives.")}
          </p>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] items-center w-full max-w-screen-lg">
          <div className="relative w-full">
            <MdFilterList className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg z-10" />
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | "all"
                    | "active"
                    | "completed"
                    | "on_hold",
                )
              }
              options={statusOptions.map((opt) => ({ label: t(opt.label), value: opt.value }))}
              className="pl-11"
            />
          </div>

          <div className="relative w-full">
            <MdFilterList className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg z-10" />
            <Select
              value={adminOnlyFilter ? "admin" : "all"}
              onChange={(event) =>
                setAdminOnlyFilter(event.target.value === "admin")
              }
              options={[
                { label: t("All Projects"), value: "all" },
                { label: t("Admin Only"), value: "admin" },
              ]}
              className="pl-11"
            />
          </div>

          <div className="relative w-full">
            <MdFilterList className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg z-10" />
            <Select
              value={deadlineStatus}
              onChange={(event) =>
                setDeadlineStatus(
                  event.target.value as "all" | "upcoming" | "overdue"
                )
              }
              options={[
                { label: t("All Deadlines"), value: "all" },
                { label: t("Upcoming"), value: "upcoming" },
                { label: t("Overdue"), value: "overdue" },
              ]}
              className="pl-11"
            />
          </div>

          <div className="relative w-full">
            <MdFilterList className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg z-10" />
            <Select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              options={[
                { label: t("Latest Created"), value: "createdAt_desc" },
                { label: t("Nearest Deadline"), value: "dueDate_asc" },
                { label: t("Recently Updated"), value: "updatedAt_desc" },
              ]}
              className="pl-11"
            />
          </div>

          <Button
            variant="primary"
            className="min-w-45 justify-center w-full sm:w-auto"
            onClick={() => {
              setEditingProject(null);
              setIsProjectModalOpen(true);
            }}
          >
            <MdAdd className="w-5 h-5" />
            {t("New Project")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-3xl bg-surface-container-highest border border-outline-variant/30">
            <div>
              <p className="font-label-lg text-label-lg text-on-surface">
                {t("Projects")}
              </p>
              <p className="font-body-sm text-secondary mt-1">
                {t("Showing")} {total} {t("projects")}
              </p>
            </div>
            <input
              type="search"
              placeholder={t("Search projects") || ""}
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              className="w-full sm:w-55 px-4 py-3 rounded-2xl border border-outline-variant/50 bg-surface-container-lowest text-body-md focus:ring-2 focus:ring-primary"
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: limit }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          ) : uiProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-lowest p-10 text-center gap-4">
              <MdFolderOpen className="text-[48px] text-secondary" />
              <p className="font-title-md text-on-surface">
                {t("No projects found matching the filter")}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {uiProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isAdmin={project.canManage}
                    onOpenDetails={() => {
                      setSelectedProject(project);
                      setIsDetailsOpen(true);
                    }}
                    onEdit={
                      project.canManage
                        ? (id) => {
                            const match = uiProjects.find(
                              (item) => item.id === id,
                            );
                            if (match) {
                              setEditingProject(match);
                              setIsProjectModalOpen(true);
                            }
                          }
                        : undefined
                    }
                    onDelete={
                      project.canManage
                        ? async (id) => {
                            const selected = uiProjects.find(
                              (item) => item.id === id,
                            );
                            if (!selected) return;
                            const confirmed = await notification.confirm(
                              t(
                                "Are you sure you want to delete this project?",
                              ) as string,
                              "This action cannot be undone",
                              t("Delete"),
                              t("Cancel"),
                            );
                            if (!confirmed) return;
                            try {
                              await deleteProject(id);
                              notification.successToast(
                                t("Project deleted successfully") as string,
                              );
                            } catch (err: any) {
                              notification.errorToast(
                                err?.message ||
                                  (t("Failed to delete project") as string),
                              );
                            }
                          }
                        : undefined
                    }
                  />
                ))}
              </div>

              <div className="mt-6 flex justify-center">
                <Pagination
                  total={total}
                  page={page}
                  limit={limit}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </>
          )}
        </div>

        <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-6">
          <h3 className="font-title-sm text-title-sm text-on-surface mb-4">
            {t("Project Overview")}
          </h3>
          <div className="space-y-4 text-body-sm text-secondary">
            <div className="flex justify-between gap-4">
              <span>{t("Current filter")}</span>
              <strong className="text-on-surface">
                {t(
                  statusOptions.find((item) => item.value === statusFilter)
                    ?.label || "All Statuses",
                )}
              </strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>{t("Page")}</span>
              <strong className="text-on-surface">{page}</strong>
            </div>
            <div className="flex justify-between gap-4">
              <span>{t("Project load")}</span>
              <strong className="text-on-surface">
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
                    <span>{t("Loading")}</span>
                  </span>
                ) : (
                  `${uiProjects.length}`
                )}
              </strong>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              {t("Prev")}
            </Button>
            <Button variant="secondary" onClick={() => setPage(page + 1)}>
              {t("Next")}
            </Button>
          </div>
        </div>
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        initial={
          editingProject
            ? {
                id: editingProject.id,
                name: editingProject.title,
                description: editingProject.description,
                deadline: editingProject.rawDeadline,
                status: editingProject.status,
              }
            : null
        }
        onSave={async (payload: ProjectCreateDTO | ProjectUpdateDTO) => {
          try {
            if (editingProject) {
              await updateProject(
                editingProject.id,
                payload as ProjectUpdateDTO,
              );
              notification.successToast(
                t("Project updated successfully") as string,
              );
            } else {
              await createProject(payload as ProjectCreateDTO);
              notification.successToast(
                t("Project created successfully") as string,
              );
            }
            setIsProjectModalOpen(false);
            setEditingProject(null);
          } catch (err: any) {
            notification.errorToast(
              err?.message || (t("Failed to save project") as string),
            );
          }
        }}
      />

      {selectedProject && (
        <ProjectDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          project={selectedProject}
        />
      )}
    </DashboardLayout>
  );
}
