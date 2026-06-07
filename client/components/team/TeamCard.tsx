import React from "react";
import { useTranslation } from "react-i18next";
import { MdGroup, MdFolderOpen, MdAssignment } from "react-icons/md";
import { Team } from "../../services/team.service";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface TeamCardProps {
  team: Team;
  onClick: (team: Team) => void;
}

export function TeamCard({ team, onClick }: TeamCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col h-full hover:shadow-elevation-2 transition-shadow cursor-pointer" onClick={() => onClick(team)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-title-lg text-title-lg text-on-surface">{team.name}</h3>
          <p className="font-body-sm text-body-sm text-secondary mt-1 line-clamp-2">
            {team.description || t("No description")}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
          <MdGroup className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-outline-variant/30">
        <div className="flex flex-col items-center">
          <span className="font-title-md text-on-surface">{team.members?.length || 0}</span>
          <span className="font-body-xs text-secondary flex items-center gap-1 mt-1">
            <MdGroup className="w-3 h-3" />
            {t("Members")}
          </span>
        </div>
        <div className="flex flex-col items-center border-l border-outline-variant/30">
          <span className="font-title-md text-on-surface">{team.projectTeams?.length || 0}</span>
          <span className="font-body-xs text-secondary flex items-center gap-1 mt-1">
            <MdFolderOpen className="w-3 h-3" />
            {t("Projects")}
          </span>
        </div>
        <div className="flex flex-col items-center border-l border-outline-variant/30">
          <span className="font-title-md text-on-surface">{team.taskTeams?.length || 0}</span>
          <span className="font-body-xs text-secondary flex items-center gap-1 mt-1">
            <MdAssignment className="w-3 h-3" />
            {t("Tasks")}
          </span>
        </div>
      </div>
    </Card>
  );
}
