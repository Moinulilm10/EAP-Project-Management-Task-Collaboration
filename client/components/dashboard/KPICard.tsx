"use client";

import React from "react";
import { Card } from "../ui/Card";
import { useTranslation } from "react-i18next";

interface KPICardProps {
  title: string;
  value: string | number;
  subValue?: string;
  variant?: "default" | "primary-highlight" | "error-highlight";
  isLoading?: boolean;
}

export function KPICard({ title, value, subValue, variant = "default", isLoading = false }: KPICardProps) {
  const { t } = useTranslation();

  const containerStyles = {
    default: "border-outline-variant/30",
    "primary-highlight": "bg-primary/5 border-primary/20",
    "error-highlight": "border-error/20 bg-error-container/10",
  };

  const titleStyles = {
    default: "text-secondary",
    "primary-highlight": "text-primary",
    "error-highlight": "text-error",
  };

  const valueStyles = {
    default: "text-on-surface",
    "primary-highlight": "text-on-surface",
    "error-highlight": "text-error",
  };

  return (
    <Card className={`relative overflow-hidden card-hover group shadow-sm p-md flex flex-col min-h-[140px] justify-between ${containerStyles[variant]}`}>
      {/* Decorative background circle with group hover scale effect */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className={`font-label-md text-label-md uppercase tracking-wider ${titleStyles[variant]}`}>
          {t(title)}
        </span>
      </div>
      
      <div className="flex items-end gap-3 mt-auto relative z-10">
        {isLoading ? (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary mb-1" />
        ) : (
          <span className={`font-display-lg text-display-lg font-bold leading-none ${valueStyles[variant]}`}>
            {value}
          </span>
        )}
        {!isLoading && subValue && (
          <span className="font-body-md text-body-md text-secondary mb-2">
            {subValue}
          </span>
        )}
      </div>
    </Card>
  );
}
