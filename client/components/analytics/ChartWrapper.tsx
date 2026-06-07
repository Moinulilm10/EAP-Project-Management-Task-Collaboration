import React from "react";
import { Card } from "../ui/Card";
import { IconButton } from "../ui/IconButton";
import { Select } from "../ui/Select";
import { MdMoreVert } from "react-icons/md";

interface ChartWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
  heightClass?: string;
  className?: string;
  actionMenu?: boolean;
  filterOptions?: { label: string; value: string }[];
}

export function ChartWrapper({
  title,
  description,
  children,
  heightClass = "h-[400px]",
  className = "",
  actionMenu,
  filterOptions,
}: ChartWrapperProps) {
  return (
    <Card className={`flex flex-col ${heightClass} ${className}`}>
      <div className="flex justify-between items-center mb-md">
        <div>
          <h3 className="font-title-md text-title-md text-on-surface">{title}</h3>
          <p className="font-body-md text-body-md text-secondary">{description}</p>
        </div>
        
        {actionMenu && (
          <IconButton icon={<MdMoreVert className="w-5 h-5" />} aria-label="More options" variant="surface" />
        )}
        
        {filterOptions && (
          <div className="flex items-center gap-sm">
            <Select
              options={filterOptions}
              className="bg-surface-container border-transparent py-xs text-label-md font-label-md text-secondary focus:ring-0 focus:border-primary"
            />
          </div>
        )}
      </div>
      <div className="flex-1 relative w-full min-h-0">
        {children}
      </div>
    </Card>
  );
}
