import React from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-label-md font-label-md transition-colors gap-xs focus:ring-2 focus:ring-primary focus:outline-none";
  
  const variants = {
    primary: "bg-primary text-on-primary px-md py-sm hover:bg-primary/90 shadow-sm",
    secondary: "bg-transparent text-secondary border border-primary px-md py-sm hover:bg-surface-container-low",
    ghost: "bg-transparent text-secondary px-xs py-1 hover:text-primary hover:bg-surface-container-high rounded",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
