import React from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  statusColor?: string;
  className?: string;
  priority?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-label-md",
  md: "w-10 h-10 text-title-sm",
  lg: "w-12 h-12 text-title-md",
  xl: "w-20 h-20 text-headline-md",
};

// Deterministic premium colors for avatar backgrounds based on user's name
const getBgColor = (nameStr: string) => {
  const colors = [
    "bg-red-500/95 text-white border-red-400/20",
    "bg-pink-500/95 text-white border-pink-400/20",
    "bg-purple-500/95 text-white border-purple-400/20",
    "bg-indigo-500/95 text-white border-indigo-400/20",
    "bg-blue-500/95 text-white border-blue-400/20",
    "bg-teal-500/95 text-white border-teal-400/20",
    "bg-emerald-500/95 text-white border-emerald-400/20",
    "bg-amber-500/95 text-white border-amber-400/20",
    "bg-orange-500/95 text-white border-orange-400/20",
    "bg-rose-500/95 text-white border-rose-400/20",
  ];
  let hash = 0;
  for (let i = 0; i < nameStr.length; i++) {
    hash = nameStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const getInitials = (nameStr: string) => {
  if (!nameStr) return "?";
  const parts = nameStr.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return nameStr.substring(0, 2).toUpperCase();
};

export function Avatar({
  src,
  alt = "Avatar",
  initials,
  name,
  size = "md",
  statusColor,
  className = "",
  priority = false,
}: AvatarProps) {
  const finalInitials = initials || (name ? getInitials(name) : "?");
  const bgClass = name ? getBgColor(name) : "bg-primary-container text-primary ";

  return (
    <div className={`relative inline-block ${sizeClasses[size]} ${className}`}>
      {src ? (
        <div className="w-full h-full rounded-full overflow-hidden border border-outline-variant/30 bg-surface-container-high animate-pulse">
          <Image
            src={src}
            alt={alt}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            priority={priority}
            unoptimized
            onLoad={(e) => {
              const target = e.target as HTMLElement;
              target.parentElement?.classList.remove("animate-pulse");
            }}
          />
        </div>
      ) : (
        <div className={`w-full h-full rounded-full flex items-center justify-center font-bold ${bgClass}`}>
          {finalInitials}
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
