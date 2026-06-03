import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
  containerClassName?: string;
}

export function Select({ options, className = "", containerClassName = "", ...props }: SelectProps) {
  return (
    <div className={`relative ${containerClassName}`}>
      <select
        className={`w-full bg-surface-bright border border-outline-variant/50 rounded-lg px-md py-sm text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
        expand_more
      </span>
    </div>
  );
}
