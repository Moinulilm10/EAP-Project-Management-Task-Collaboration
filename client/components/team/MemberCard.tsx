import React from "react";
import { Card } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { IconButton } from "../ui/IconButton";
import { ProgressBar } from "../ui/ProgressBar";
import { useTranslation } from "react-i18next";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  initials?: string;
  status: "online" | "offline" | "busy";
  tasks: {
    total: number;
    done: number;
    todo: number;
  };
  capacity: number; // 0 to 100
}

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-tertiary-fixed";
      case "busy":
        return "bg-error";
      default:
        return "bg-outline";
    }
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 90) return "bg-error";
    if (capacity >= 70) return "bg-primary";
    return "bg-tertiary-container";
  };

  return (
    <Card className="hover-lift">
      <div className="flex items-start justify-between mb-md">
        <div className="flex items-center gap-sm">
          <Avatar
            src={member.avatarUrl}
            initials={member.initials}
            alt={member.name}
            size="lg"
            statusColor={getStatusColor(member.status)}
          />
          <div>
            <h4 className="font-title-md text-title-md text-on-surface">{member.name}</h4>
            <p className="font-label-sm text-label-sm text-primary uppercase tracking-wider mt-xs">
              {member.role}
            </p>
          </div>
        </div>
        <IconButton icon="more_vert" aria-label={t("More options")} />
      </div>

      <div className="grid grid-cols-3 gap-xs mb-md p-sm bg-surface-container-low rounded-lg text-center">
        <div>
          <span className="block font-title-md text-title-md text-on-surface">{member.tasks.total}</span>
          <span className="block font-label-sm text-label-sm text-secondary">{t("Total")}</span>
        </div>
        <div className="border-l border-outline-variant/30">
          <span className="block font-title-md text-title-md text-on-surface">{member.tasks.done}</span>
          <span className="block font-label-sm text-label-sm text-secondary">{t("Done")}</span>
        </div>
        <div className="border-l border-outline-variant/30">
          <span className="block font-title-md text-title-md text-on-surface">{member.tasks.todo}</span>
          <span className="block font-label-sm text-label-sm text-secondary">{t("To Do")}</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-xs">
          <span className="font-label-sm text-label-sm text-secondary">{t("Workload Capacity")}</span>
          <span className="font-label-sm text-label-sm text-on-surface font-semibold">{member.capacity}%</span>
        </div>
        <ProgressBar
          value={member.capacity}
          heightClass="h-1.5"
          colorClass={getCapacityColor(member.capacity)}
        />
      </div>
    </Card>
  );
}
