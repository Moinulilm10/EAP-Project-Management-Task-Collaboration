import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  isAnimating?: boolean;
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, icon, error, isAnimating, className = "", id, ...props }, ref) => {
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
            className={`block w-full pr-3 py-2.5 border rounded-lg bg-surface focus:bg-surface-container-lowest input-glow font-body-md text-body-md text-on-surface transition-all duration-200 ${icon ? "pl-10" : "px-3"
              } ${error
                ? "border-error focus:ring-error/50"
                : isAnimating
                  ? "ring-2 ring-primary border-transparent"
                  : "border-outline-variant"
              } ${className}`}
            {...props}
          />
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
