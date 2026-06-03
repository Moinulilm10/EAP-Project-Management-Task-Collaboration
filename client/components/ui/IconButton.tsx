import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "ghost" | "surface" | "primary";
}

export function IconButton({ icon, variant = "ghost", className = "", ...props }: IconButtonProps) {
  const baseStyles = "flex items-center justify-center p-xs rounded-full transition-colors duration-200";
  
  const variants = {
    ghost: "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40",
    surface: "text-secondary hover:text-primary hover:bg-surface-container-high",
    primary: "bg-primary text-on-primary hover:bg-primary/90",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {icon}
    </button>
  );
}
