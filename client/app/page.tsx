import React from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            All Projects
          </h2>
          <p className="font-body-md text-body-md text-secondary mt-xs">
            Manage and track your team's ongoing initiatives.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              filter_list
            </span>
            <select className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-body-md focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Completed</option>
              <option>On Hold</option>
            </select>
          </div>
          <Button variant="primary" className="whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
        {/* Card 1: Active */}
        <Card className="h-full">
          <div className="flex justify-between items-start mb-sm">
            <Badge variant="active">Active</Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
              <button className="p-1 text-secondary hover:text-primary rounded hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button className="p-1 text-secondary hover:text-error rounded hover:bg-error-container/50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
          <h3 className="font-title-md text-title-md text-on-surface mb-xs">
            Q3 Marketing Campaign
          </h3>
          <p className="font-body-md text-body-md text-secondary line-clamp-2 mb-md flex-1">
            Executing the multi-channel marketing strategy for the new product launch across digital platforms.
          </p>
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-xs font-label-sm text-label-sm">
              <span className="text-secondary flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">calendar_today</span> Oct 15
              </span>
              <span className="text-primary font-bold">80%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[80%]"></div>
            </div>
          </div>
        </Card>

        {/* Card 2: Near Deadline */}
        <Card className="h-full">
          <div className="flex justify-between items-start mb-sm">
            <Badge variant="active">Active</Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
              <button className="p-1 text-secondary hover:text-primary rounded hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button className="p-1 text-secondary hover:text-error rounded hover:bg-error-container/50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
          <h3 className="font-title-md text-title-md text-on-surface mb-xs">
            Client Portal Redesign
          </h3>
          <p className="font-body-md text-body-md text-secondary line-clamp-2 mb-md flex-1">
            Overhauling the user interface and experience for the primary enterprise client dashboard.
          </p>
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-xs font-label-sm text-label-sm">
              <span className="text-error flex items-center gap-xs font-bold">
                <span className="material-symbols-outlined text-[14px]">warning</span> Tomorrow
              </span>
              <span className="text-primary font-bold">92%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[92%]"></div>
            </div>
          </div>
        </Card>

        {/* Card 3: Completed */}
        <Card className="h-full opacity-75 hover:opacity-100">
          <div className="flex justify-between items-start mb-sm">
            <Badge variant="completed">Completed</Badge>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-xs">
              <button className="p-1 text-secondary hover:text-primary rounded hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button className="p-1 text-secondary hover:text-error rounded hover:bg-error-container/50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
          <h3 className="font-title-md text-title-md text-on-surface mb-xs">
            Server Migration V2
          </h3>
          <p className="font-body-md text-body-md text-secondary line-clamp-2 mb-md flex-1">
            Migrated legacy databases to the new cloud infrastructure with zero downtime.
          </p>
          <div className="mt-auto">
            <div className="flex justify-between items-center mb-xs font-label-sm text-label-sm">
              <span className="text-secondary flex items-center gap-xs">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Sep 01
              </span>
              <span className="text-secondary font-bold">100%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full w-full"></div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
