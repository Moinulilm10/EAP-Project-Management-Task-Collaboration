import React from "react";

export type BadgeVariant = "active" | "completed" | "on-hold";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = "" }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-xs py-1 rounded-full text-label-sm font-label-sm border";

  const variants = {
    active: "bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20",
    completed: "bg-secondary-container/30 text-on-secondary-container border-secondary-container",
    "on-hold": "bg-error-container/10 text-error border-error-container/20",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
