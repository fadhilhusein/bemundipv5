"use client";

import { useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { AdminRole } from "@/lib/admins";
import { getNavGroups } from "@/lib/dashboard-nav";

type SidebarProps = {
  userEmail: string | null;
  role: AdminRole;
  onNavigate?: () => void;
};

export function Sidebar({ userEmail, role, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navGroups = getNavGroups(role);
  const busyRef = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    if (busyRef.current) return;
    busyRef.current = true; setLeaving(true); setError(null);
    try {
      const response = await fetch("/api/auth/session", { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal keluar. Coba lagi.");
      await signOut(getFirebaseAuth());
      router.push("/login");
    } catch { setError("Gagal keluar. Periksa koneksi dan coba lagi."); setLeaving(false); busyRef.current = false; }
  };

  return (
    <div className="flex h-full flex-col bg-charcoal text-white">
      <div className="flex min-h-[80px] items-center gap-3 border-b border-white/10 px-6">
        <Image
          src="/assets/logo-bem.png"
          alt="Logo BEM UNDIP"
          width={44}
          height={44}
          className="h-11 w-11 object-contain"
        />
        <span className="text-sm font-semibold tracking-wide">BEM UNDIP</span>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p className="px-2 text-[13px] font-semibold uppercase tracking-wider text-[#B5BBC5]">
              {group.label}
            </p>
            <ul className="mt-3 flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href === "/dashboard/master" && pathname.startsWith("/dashboard/master/"));
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 rounded-[10px] px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-accent text-charcoal"
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
        <p className="break-words text-[13px] text-[#B5BBC5]">Masuk sebagai</p>
        <p className="break-words text-sm font-semibold">{userEmail ?? "Pengurus"}</p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={leaving}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] min-h-11 border border-white/20 py-2.5 text-sm font-semibold text-white/85 transition hover:border-white/40 hover:text-white"
        >
          <LogOut size={16} />
          {leaving ? "Memproses..." : "Keluar"}
        </button>
        {error && <p role="alert" className="mt-3 text-[13px] text-[#FFD0C8]">{error}</p>}
      </div>
    </div>
  );
}
