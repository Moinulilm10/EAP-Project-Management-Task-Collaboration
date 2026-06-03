import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <article
      className={`glass-panel rounded-xl p-md ambient-shadow group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col ${className}`}
    >
      {children}
    </article>
  );
}
