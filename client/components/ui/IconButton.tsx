"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface IconButtonProps extends HTMLMotionProps<"button"> {
  icon: React.ReactNode;
  variant?: "ghost" | "surface" | "primary";
}

export function IconButton({ icon, variant = "ghost", className = "", ...props }: IconButtonProps) {
  const baseStyles = "flex items-center justify-center p-xs rounded-full transition-colors duration-200 cursor-pointer";
  
  const variants = {
    ghost: "text-on-surface-variant hover:text-primary hover:bg-surface-container-high/40",
    surface: "text-secondary hover:text-primary hover:bg-surface-container-high",
    primary: "bg-primary text-on-primary hover:bg-primary/90",
  };

  return (
    <motion.button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {icon}
    </motion.button>
  );
}
