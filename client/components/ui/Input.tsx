import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
  containerClassName?: string;
}

export function Input({ icon, className = "", containerClassName = "", ...props }: InputProps) {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      {icon && (
        <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[20px] pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`w-full bg-surface-container-lowest border border-outline-variant/50 rounded-full py-xs text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow placeholder:text-on-surface-variant/60 shadow-sm ${
          icon ? "pl-xl pr-md" : "px-md"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
