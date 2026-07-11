"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const baseColors = [
  "#FD6900",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#FF5722",
  "#795548",
];

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const lightenColor = (hex: string, percent: number) => {
  const rgb = hexToRgb(hex);
  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * percent));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * percent));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * percent));
  return `rgb(${r}, ${g}, ${b})`;
};

const getGradient = (id: string) => {
  const hash = id.split("").reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
  const baseColor = baseColors[hash % baseColors.length];
  const lighterColor = lightenColor(baseColor, 0.4);
  return `linear-gradient(180deg, ${baseColor} 0%, ${lighterColor} 100%)`;
};

interface UserAvatarProps {
  id: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-6 w-6 text-xs",
  lg: "h-8 w-8 text-sm",
};

export function UserAvatar({ id, name, size = "md", className }: UserAvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <Avatar className={`${sizeClasses[size]} ${className || ""}`}>
      <AvatarFallback
        className="text-white font-medium"
        style={{ background: getGradient(id) }}
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}
