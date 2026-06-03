import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  colorClass?: string; // e.g., "bg-primary" or "bg-error"
  heightClass?: string; // e.g., "h-2" or "h-1.5"
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  colorClass = "bg-primary",
  heightClass = "h-2",
  className = "",
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`w-full bg-surface-variant ${heightClass} rounded-full overflow-hidden ${className}`}>
      <div
        className={`${colorClass} h-full rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
