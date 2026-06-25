"use client";

import React, { useState } from "react";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Helper to resolve avatar asset paths
const resolveAvatarSrc = (srcStr: string | null | undefined): string | null => {
  if (!srcStr) return null;
  
  const normalized = srcStr.toLowerCase();
  
  // Check for female avatars
  for (let i = 1; i <= 6; i++) {
    if (normalized.includes(`female_avatar_${i}`)) {
      return `/avatars/Female_Avatar_${i}.png`;
    }
  }
  
  // Check for male avatars
  for (let i = 1; i <= 6; i++) {
    if (normalized.includes(`male_avatar_${i}`)) {
      return `/avatars/Male_Avatar_${i}.png`;
    }
  }
  
  // Check for legacy avatar keys
  for (let i = 1; i <= 6; i++) {
    if (normalized.includes(`avatar_${i}`)) {
      return `/avatars/Male_Avatar_${i}.png`;
    }
  }
  
  return srcStr;
};

export default function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-[10px]",
    md: "w-10 h-10 text-xs",
    lg: "w-12 h-12 text-sm",
    xl: "w-16 h-16 text-lg",
  };

  const cleanName = (name || "").trim();
  
  // Extract initials (e.g. "Sarah Lawrence" -> "SL")
  const initials = cleanName
    ? cleanName.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  // Hash name to get a stable aesthetic gradient from a curated list
  const getGradient = (str: string) => {
    const gradients = [
      "from-[#fa48ab] to-[#ff68bd]", // Hot Pink brand
      "from-blue-500 to-indigo-600", // Blue
      "from-purple-500 to-pink-500", // Purple
      "from-emerald-500 to-teal-600", // Teal/Emerald
      "from-amber-500 to-orange-600", // Amber/Orange
    ];
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const gradientClass = getGradient(cleanName || "Twinning");

  const resolvedSrc = resolveAvatarSrc(src);

  if (resolvedSrc && !error) {
    return (
      <div className={`relative shrink-0 rounded-full overflow-hidden border border-white/10 ${sizeClasses[size]} ${className}`}>
        <img
          src={resolvedSrc}
          alt={cleanName || "User avatar"}
          onError={() => setError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br ${gradientClass} border border-white/10 ${sizeClasses[size]} ${className}`}>
      {initials}
    </div>
  );
}
