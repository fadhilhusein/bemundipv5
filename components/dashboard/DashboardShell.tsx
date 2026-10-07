"use client";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";
import { trapDialogFocus } from "./AdminDialog";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import type { AdminRole } from "@/lib/admins";
import { getNavGroups } from "@/lib/dashboard-nav";
import { TABLES } from "@/lib/data/tables";
export function DashboardShell({ userEmail, role, children }: {
    userEmail: string | null;
    role: AdminRole;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const dialog = useRef<HTMLDialogElement>(null);
    const [scope, animate] = useAnimate();
    const reduced = useReducedMotion();
    const pathname = usePathname();
    const slug = pathname.split("/")[3];
    const title = pathname.startsWith("/dashboard/master/") ? TABLES[slug]?.label ?? "Menu Master" : getNavGroups(role).flatMap(group => group.items).find(item => item.href === pathname)?.label ?? "Dashboard";
    useEffect(() => { setOpen(false); }, [pathname]);
    useEffect(() => { const media = matchMedia("(min-width: 1024px)"); const close = () => { if (media.matches)
        setOpen(false); }; media.addEventListener("change", close); return () => media.removeEventListener("change", close); }, []);
    useEffect(() => {
        if (!open)
            return;
        const opener = document.activeElement as HTMLElement | null;
        const current = dialog.current;
        const overflow = document.body.style.overflow;
        current?.showModal();
        document.body.style.overflow = "hidden";
        if (scope.current)
            void animate(scope.current, { x: reduced ? [0, 0] : [-12, 0], opacity: [0.8, 1] }, { duration: reduced ? 0 : 0.2 });
        return () => { current?.close(); document.body.style.overflow = overflow; opener?.focus(); };
    }, [open, animate, scope, reduced]);
    return <div className="admin-theme admin-shell">
    <aside className="admin-desktop-sidebar"><Sidebar userEmail={userEmail} role={role}/></aside>
    <dialog onKeyDown={trapDialogFocus} ref={dialog} className="admin-theme admin-drawer" aria-label="Navigasi CMS" onCancel={e => { e.preventDefault(); setOpen(false); }} onClick={e => { if (e.target === e.currentTarget)
        setOpen(false); }}><div ref={scope} className="relative h-full"><button type="button" aria-label="Tutup menu" className="admin-icon-button admin-drawer-close" onClick={() => setOpen(false)}><X size={20}/></button><Sidebar userEmail={userEmail} role={role} onNavigate={() => setOpen(false)}/></div></dialog>
    <div className="admin-workspace"><Topbar title={title} onOpenSidebar={() => setOpen(true)}/><main className="admin-main"><div className="mx-auto w-full max-w-[1280px]">{children}</div></main></div>
  </div>;
}
