"use client";

import { useState } from "react";

const EXTENSIONS = ["png", "jpg", "jpeg", "webp", "svg", "avif"];

type BidangLogoProps = {
  id: number;
  alt: string;
  className?: string;
};

export function BidangLogo({ id, alt, className }: BidangLogoProps) {
  const [extIndex, setExtIndex] = useState(0);
  const ext = EXTENSIONS[extIndex];
  if (!ext) return null;

  return (
    <img
      src={`/assets/bidang/${id}.${ext}`}
      alt={alt}
      className={className ?? "mx-auto h-16 w-16 rounded-full object-contain"}
      onError={() => setExtIndex((i) => i + 1)}
    />
  );
}
