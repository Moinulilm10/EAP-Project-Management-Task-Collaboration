"use client";

import React from "react";
import { Card } from "../ui/Card";
import { useTranslation } from "react-i18next";
import { MemberWorkloadItem } from "../../services/dashboard.service";

interface MemberWorkloadProps {
  workload: MemberWorkloadItem[];
}

export function MemberWorkload({ workload = [] }: MemberWorkloadProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-md flex flex-col mt-gutter shrink-0">
      <div className="flex justify-between items-center mb-md">
        <h3 className="font-title-md text-title-md text-on-surface">
          {t("Member Workload Summary")}
        </h3>
      </div>

      {workload.length === 0 ? (
        <div className="flex items-center justify-center text-secondary py-md font-body-md">
          {t("No active workloads.")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-sm">
          {workload.map((member) => (
            <div
              key={member.userId}
              className="flex items-center gap-sm p-sm rounded-lg bg-surface-container-low border border-outline-variant/10"
            >
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[14px]">
                {member.userInitials}
              </div>
              <div className="min-w-0">
                <p className="font-body-md font-semibold text-on-surface truncate">
                  {member.userName}
                </p>
                <p className="font-label-sm text-secondary">
                  {member.taskCount} {t("Tasks Pending")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
