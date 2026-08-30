import { LayoutGrid, Image, Wrench, CalendarDays, Sparkles, BarChart3, ShieldCheck, Newspaper, type LucideIcon } from "lucide-react";
import type { AdminRole } from "@/lib/admins";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Umum",
    items: [{ label: "Input Data Bidang", href: "/dashboard", icon: LayoutGrid }]
  },
  {
    label: "Profil Kabinet",
    items: [
      { label: "Master Kabinet", href: "/dashboard/kabinet", icon: LayoutGrid },
      { label: "Media Sosial", href: "/dashboard/media-sosial", icon: Image },
      { label: "Layanan", href: "/dashboard/layanan", icon: Wrench }
    ]
  },
  {
    label: "Konten",
    items: [
      { label: "Publikasi", href: "/dashboard/publikasi", icon: Newspaper },
      { label: "Agenda", href: "/dashboard/agenda", icon: CalendarDays },
      { label: "Program Unggulan", href: "/dashboard/program-unggulan", icon: Sparkles }
    ]
  },
  {
    label: "Statistik",
    items: [{ label: "Statistik Kabinet", href: "/dashboard/statistik", icon: BarChart3 }]
  }
];

export const masterNavGroup: NavGroup = {
  label: "Master Admin",
  items: [{ label: "Menu Master", href: "/dashboard/master", icon: ShieldCheck }]
};

export const bidangNavGroups: NavGroup[] = [
  {
    label: "Umum",
    items: [{ label: "Profil Bidang Saya", href: "/dashboard", icon: LayoutGrid }]
  }
];

export function getNavGroups(role: AdminRole | null): NavGroup[] {
  if (role === "bidang") return bidangNavGroups;
  return role === "master" ? [...navGroups, masterNavGroup] : navGroups;
}

export const navItems: NavItem[] = [...navGroups, masterNavGroup].flatMap((group) => group.items);
