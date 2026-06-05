"use client";

import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  isAnimating?: boolean;
  showPasswordToggle?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, icon, error, isAnimating, showPasswordToggle, className = "", id, type = "text", ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    const inputType = showPasswordToggle
      ? isPasswordVisible
        ? "text"
        : "password"
      : type;

    return (
      <div className="space-y-1.5 w-full">
        <label className="block font-label-md text-label-md text-on-surface-variant uppercase" htmlFor={id}>
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline text-[20px] w-10 h-10">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={`block w-full pr-10 py-2.5 border rounded-lg bg-surface focus:bg-surface-container-lowest input-glow font-body-md text-body-md text-on-surface transition-all duration-200 ${icon ? "pl-10" : "px-3"
              } ${error
                ? "border-error focus:ring-error/50"
                : isAnimating
                  ? "ring-2 ring-primary border-transparent"
                  : "border-outline-variant"
              } ${className}`}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            >
              {isPasswordVisible ? <MdVisibilityOff className="text-[20px]" /> : <MdVisibility className="text-[20px]" />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[10px] font-semibold text-error mt-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
