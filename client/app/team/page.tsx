"use client";

import React from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeamOverview } from "@/components/team/TeamOverview";
import { MemberCard, Member } from "@/components/team/MemberCard";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";

const TEAM_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    role: "Project Manager",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKsuP-Y7iCFVuBchgjX33xf60EnmK_8II5r_h8AaoXS6eJ-T1sQUbjc_QHYKMYqiOwS-hSUiNOWaOqQyVjAnBKZC7FZ3Htzie5PEhkvRs0DY08Z0H9EUCOikxHS9kwxM9-MtKajOCWkb3VXu3xxdhhgqoIDI9he7-qs9om1etzMJAelKdQmXLRu57_ma1snc46oWDQRgRn1jxCUrnuV__GPhg61JbNZTl_FZmvlqUXL0KaumnAnqx7uQKtC-mUGfKamgQ2iTFtSnQ",
    status: "online",
    tasks: { total: 24, done: 18, todo: 6 },
    capacity: 90,
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Lead Developer",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmZBl_xn__wIQueLDKrVghmqDihoRb1MByMDVJFtwzr-CJLLhfBl3fJtq0Qgm0xWz0UjD2U4o5WjG4t51_B9zyGhJm3HXpRiTHuRgkQZ_EGe3Y-DvV9Rv55GhcWmMI6_ZCKI2jNNfAktdIbptlORelym6wMU4xOMqc8nEgRcNp-6hcSUYYHXUVh-0HZFmGAWrEJwY1DJ-yWn1SoxE9INhj6pv1AYcltTDtDIIaRkU_nsZ_GVeA98l5caTvDuB-6hpPhvaz8MkKPyw",
    status: "online",
    tasks: { total: 42, done: 30, todo: 12 },
    capacity: 65,
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "UX Designer",
    initials: "EJ",
    status: "offline",
    tasks: { total: 15, done: 12, todo: 3 },
    capacity: 40,
  },
];

export default function TeamPage() {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="bg-background text-on-background font-body-lg min-h-screen flex antialiased">
      <SideNavBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <TopNavBar onMenuClick={() => setIsSidebarOpen(true)} />
      
      <PageWrapper>
        <PageHeader
          title={t("Team Directory")}
          description={t("Manage team members, roles, and current workload capacity.")}
          actions={
            <>
              <Button variant="secondary">
                <span className="material-symbols-outlined text-[18px]">{t("filter_list")}</span>
                {t("Filter")}
              </Button>
              <Button variant="primary">
                <span className="material-symbols-outlined text-[18px]">{t("person_add")}</span>
                {t("Add Member")}
              </Button>
            </>
          }
        />
        
        <TeamOverview />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {TEAM_MEMBERS.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </PageWrapper>
    </div>
  );
}
