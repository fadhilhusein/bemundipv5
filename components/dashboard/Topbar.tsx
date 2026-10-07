"use client";
import { Menu, ExternalLink } from "lucide-react";
import Link from "next/link";
export function Topbar({ title, onOpenSidebar }: {
    title: string;
    onOpenSidebar: () => void;
}) {
    return <header className="admin-topbar"><button type="button" onClick={onOpenSidebar} aria-label="Buka menu" aria-haspopup="dialog" className="admin-icon-button lg:hidden"><Menu size={20}/></button><h1>{title}</h1><Link href="/" className="admin-website-link"><ExternalLink size={17} aria-hidden="true"/><span>Lihat website</span></Link></header>;
}
