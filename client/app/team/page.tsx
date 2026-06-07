"use client";

import React, { useEffect, useState } from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeamOverview } from "@/components/team/TeamOverview";
import { TeamCard } from "@/components/team/TeamCard";
import { TeamDetailsModal } from "@/components/team/TeamDetailsModal";
import { CreateTeamModal } from "@/components/team/CreateTeamModal";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { useTeamStore } from "@/stores/teamStore";
import { Team } from "@/services/team.service";
import { Select } from "@/components/ui/Select";
import { useAuthStore } from "@/stores/authStore";

export default function TeamPage() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { teams, fetchTeams, createTeam, loading, meta } = useTeamStore();
  const { user } = useAuthStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTeams(page);
  }, [fetchTeams, page]);

  const filteredTeams = React.useMemo(() => {
    let result = teams;

    // Apply Dropdown Filter
    if (filterStatus === "my_teams" && user) {
      result = result.filter((team) =>
        team.members?.some((m) => m.user?.id === user.id)
      );
    } else if (filterStatus === "has_projects") {
      result = result.filter((team) => (team.projectTeams?.length || 0) > 0);
    }

    // Apply Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (team) =>
          team.name.toLowerCase().includes(query) ||
          team.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [teams, searchQuery, filterStatus, user]);

  return (
    <div className="bg-background text-on-background font-body-lg min-h-screen flex antialiased">
      <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <PageWrapper>
        <PageHeader
          title={t("Team Directory")}
          description={t("Manage teams, roles, projects, and tasks.")}
          actions={
            <Button variant="primary" className="flex items-center gap-1" onClick={() => setIsCreateModalOpen(true)}>
              <MdAdd className="w-[18px] h-[18px]" />
              {t("Create Team")}
            </Button>
          }
        />
        
        <TeamOverview />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-5 py-4 rounded-3xl bg-surface-container-highest border border-outline-variant/30">
          <div>
            <p className="font-label-lg text-label-lg text-on-surface">{t("Teams")}</p>
            <p className="font-body-sm text-secondary mt-1">
              {t("Showing")} {filteredTeams.length} {t("teams")}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-48">
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { label: t("All Teams"), value: "all" },
                  { label: t("My Teams"), value: "my_teams" },
                  { label: t("Has Projects"), value: "has_projects" },
                ]}
              />
            </div>
            <input
              type="search"
              placeholder={t("Search teams...") || ""}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-[10px] rounded-xl border border-outline-variant/60 bg-surface-bright dark:bg-surface-container-lowest text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary shadow-sm transition-all duration-200"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} onClick={setSelectedTeam} />
            ))}
            {filteredTeams.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant/30">
                <p className="text-secondary">
                  {searchQuery ? t("No teams match your search.") : t("No teams found. Create one to get started.")}
                </p>
              </div>
            )}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 mb-4">
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              {t("Previous")}
            </Button>
            <span className="text-body-md text-on-surface">
              {t("Page")} {page} {t("of")} {meta.totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
            >
              {t("Next")}
            </Button>
          </div>
        )}

      </PageWrapper>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={async (payload) => {
          await createTeam(payload);
          setIsCreateModalOpen(false);
        }}
      />

      {selectedTeam && (
        <TeamDetailsModal
          isOpen={true}
          onClose={() => setSelectedTeam(null)}
          team={selectedTeam}
        />
      )}
    </div>
  );
}
