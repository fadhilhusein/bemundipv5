"use client";

import { Menu } from "lucide-react";

type TopbarProps = {
  title: string;
  onOpenSidebar: () => void;
};

export function Topbar({ title, onOpenSidebar }: TopbarProps) {
  return (
    <div className="flex h-16 items-center gap-4 border-b border-divider bg-white px-5 sm:px-8">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Buka menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-brown transition hover:bg-cream lg:hidden"
      >
        <Menu size={20} />
      </button>
      <h1 className="font-display text-lg font-medium text-brown sm:text-xl">
        {title}
      </h1>
    </div>
  );
}
