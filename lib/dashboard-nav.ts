import { LayoutGrid, Image, Wrench, CalendarDays, Sparkles, BarChart3, type LucideIcon } from "lucide-react";

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
      { label: "Agenda", href: "/dashboard/agenda", icon: CalendarDays },
      { label: "Program Unggulan", href: "/dashboard/program-unggulan", icon: Sparkles }
    ]
  },
  {
    label: "Statistik",
    items: [{ label: "Statistik Kabinet", href: "/dashboard/statistik", icon: BarChart3 }]
  }
];

export const navItems: NavItem[] = navGroups.flatMap((group) => group.items);
