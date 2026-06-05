"use client";

import { Card } from "../ui/Card";

export function ProjectCardSkeleton() {
  return (
    <Card>
      <div className="animate-pulse">
        <div className="h-5 w-24 bg-surface-container-low rounded mb-4" />
        <div className="h-6 w-3/4 bg-surface-container-low rounded mb-3" />
        <div className="h-3 w-1/3 bg-surface-container-low rounded mb-6" />
        <div className="flex items-center justify-between mt-4">
          <div className="h-3 w-40 bg-surface-container-low rounded" />
          <div className="h-3 w-12 bg-surface-container-low rounded" />
        </div>
        <div className="mt-3 h-2 bg-surface-container-low rounded" />
      </div>
    </Card>
  );
}

export default ProjectCardSkeleton;
