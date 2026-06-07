import React from "react";
import { KpiCard } from "../shared/KpiCard";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { useTranslation } from "react-i18next";
import { MdGroup, MdSpeed, MdAssignmentLate } from "react-icons/md";
import { useTeamStore } from "../../stores/teamStore";

export function TeamOverview() {
  const { t } = useTranslation();
  const { teams } = useTeamStore();

  const totalTeams = teams.length;
  // Calculate total pending tasks across all teams
  const pendingTasks = teams.reduce((acc, team) => {
    return acc + (team.taskTeams?.filter((t) => t.task?.status !== "done").length || 0);
  }, 0);
  const activeProjects = teams.reduce((acc, team) => acc + (team.projectTeams?.length || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-lg">
      {/* Total Teams */}
      <KpiCard
        title={t("Total Teams")}
        value={totalTeams.toString()}
        icon={<MdGroup className="w-[18px] h-[18px]" />}
        subtitle={t("Active Teams")}
        customDecorative={
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
            <MdGroup className="text-[120px]" />
          </div>
        }
      />

      {/* Overall Capacity */}
      <Card className="justify-between relative overflow-hidden h-full">
        <div className="flex justify-between items-start mb-md z-10">
          <h3 className="font-title-md text-title-md text-on-surface">{t("Overall Capacity")}</h3>
          <span className="p-xs bg-secondary-container rounded-full text-on-secondary-container flex items-center justify-center">
            <MdSpeed className="w-6 h-6" />
          </span>
        </div>
        <div className="z-10">
          <span className="font-display-lg text-display-lg text-on-surface">82%</span>
          <ProgressBar value={82} className="mt-sm" />
          <p className="font-body-md text-body-md text-secondary mt-xs">{t("Optimal utilization")}</p>
        </div>
      </Card>

      {/* Pending Tasks */}
      <Card className="justify-between relative overflow-hidden !bg-primary !text-on-primary !border-none h-full">
        <div className="flex justify-between items-start mb-md z-10">
          <h3 className="font-title-md text-title-md text-on-primary/90">{t("Pending Tasks")}</h3>
          <span className="p-xs bg-on-primary/20 rounded-full text-on-primary flex items-center justify-center">
            <MdAssignmentLate className="w-6 h-6" />
          </span>
        </div>
        <div className="z-10">
          <span className="font-display-lg text-display-lg text-on-primary">{pendingTasks}</span>
          <p className="font-body-md text-body-md text-on-primary/80 mt-xs">{t(`Across ${activeProjects} active projects`)}</p>
        </div>
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </Card>
    </div>
  );
}
