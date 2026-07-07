"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

type DashboardShellProps = {
  userEmail: string | null;
  children: React.ReactNode;
};

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="fixed h-screen w-72">
          <Sidebar userEmail={userEmail} />
        </div>
      </aside>

      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isSidebarOpen ? "visible" : "invisible"
        }`}
        aria-hidden={!isSidebarOpen}
      >
        <div
          className={`absolute inset-0 bg-brown/40 transition-opacity ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-72 max-w-[80%] transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="relative h-full">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Tutup menu"
              className="absolute right-3 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X size={18} />
            </button>
            <Sidebar userEmail={userEmail} onNavigate={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 flex-col max-w-full">
        <Topbar title="Input Data Bidang" onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
