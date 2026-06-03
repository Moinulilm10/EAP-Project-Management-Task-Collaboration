import React from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
  statusColor?: string; // e.g., "bg-tertiary-fixed"
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-label-md",
  md: "w-10 h-10 text-title-sm",
  lg: "w-12 h-12 text-title-md",
  xl: "w-20 h-20 text-headline-md",
};

export function Avatar({
  src,
  alt = "Avatar",
  initials,
  size = "md",
  statusColor,
  className = "",
}: AvatarProps) {
  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      {src ? (
        <div className="w-full h-full rounded-full overflow-hidden border border-outline-variant/30">
          <Image
            src={src}
            alt={alt}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-primary-container text-primary flex items-center justify-center font-bold border border-outline-variant/30">
          {initials}
        </div>
      )}
      {statusColor && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} rounded-full border-2 border-surface-container-lowest`}
        ></span>
      )}
    </div>
  );
}
