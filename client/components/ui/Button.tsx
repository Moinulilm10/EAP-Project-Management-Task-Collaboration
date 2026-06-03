"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function Button({ variant = "primary", children, className = "", ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-label-md font-label-md transition-colors gap-xs focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-on-primary px-md py-sm hover:bg-primary/90 shadow-sm",
    secondary: "bg-transparent text-primary border border-primary px-md py-sm hover:bg-primary-container/10",
    ghost: "bg-transparent text-secondary px-xs py-1 hover:text-primary hover:bg-surface-container-high rounded",
  };

  return (
    <motion.button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
