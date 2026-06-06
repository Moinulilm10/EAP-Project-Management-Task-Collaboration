import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  containerClassName?: string;
}

export function Input({ icon, className = "", containerClassName = "", ...props }: InputProps) {
  return (
    <div className={`relative w-full ${containerClassName}`}>
      {icon && (
        <div className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-[20px] pointer-events-none flex items-center justify-center">
          {icon}
        </div>
      )}
      <input
        className={`w-full bg-surface-container-lowest border border-outline-variant/50 rounded-full py-sm text-body-md font-body-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow placeholder:text-on-surface-variant/60 shadow-sm ${
          icon ? "pl-xl pr-md" : "px-md"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
