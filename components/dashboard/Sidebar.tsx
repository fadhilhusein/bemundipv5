"use client";

import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { navGroups } from "@/lib/dashboard-nav";

type SidebarProps = {
  userEmail: string | null;
  onNavigate?: () => void;
};

export function Sidebar({ userEmail, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(getFirebaseAuth());
    router.push("/login");
  };

  return (
    <div className="flex h-full flex-col bg-brown text-white">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <Image
          src="/assets/bemundip.png"
          alt="Kabinet Universitas Diponegoro"
          width={44}
          height={34}
          className="h-9 w-auto object-contain"
        />
        <span className="text-sm font-semibold tracking-wide">BEM UNDIP</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              {group.label}
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-orange text-white"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 px-6 py-5">
        <p className="truncate text-xs text-white/50">Masuk sebagai</p>
        <p className="truncate text-sm font-semibold">{userEmail ?? "Pengurus"}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 py-2.5 text-sm font-semibold text-white/85 transition hover:border-white/40 hover:text-white"
        >
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </div>
  );
}
