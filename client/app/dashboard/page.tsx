"use client";

import { RouteGuard } from "@/components/providers/RouteGuard";
import DashboardContent from "@/app/page";

// Example of how to protect the dashboard and wrap the original page content
export default function Dashboard() {
  return (
    <RouteGuard>
      {/* Assuming we just redirect existing functionality into this guard */}
      <DashboardContent />
    </RouteGuard>
  );
}
