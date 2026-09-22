"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Departemen", href: "/#bidang" },
  { label: "Publikasi", href: "/#berita" },
  { label: "Agenda", href: "/agenda" },
  { label: "Layanan", href: "/#layanan" },
  { label: "Log in", href: "/login" }
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#beranda");
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/" && href === `/${activeHash}`;
    return pathname.startsWith(href.split("#")[0]);
  };

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash || "#beranda");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleNavigation = (href: string) => {
    if (href.startsWith("/#")) setActiveHash(href.slice(1));
    setIsOpen(false);
  };

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-[70] -translate-y-24 rounded-full bg-white px-4 py-2 font-semibold text-ink shadow-float transition focus:translate-y-0"
      >
        Lewati ke konten
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1180px] items-center gap-2.5 lg:gap-3">
          <div className="flex h-[52px] min-w-0 flex-1 items-center rounded-full border border-white/25 bg-charcoal/95 p-1.5 shadow-[0_12px_32px_rgba(23,23,23,0.16)] backdrop-blur-xl lg:h-16 lg:px-2">
            <Link
              href="/#beranda"
              onClick={() => handleNavigation("/#beranda")}
              className={`inline-flex h-full items-center rounded-full px-4 text-sm font-bold text-white transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:px-5 ${
                isActive("/#beranda") ? "bg-accent hover:bg-accent-deep" : "hover:bg-white/10"
              }`}
              aria-label="BEM UNDIP beranda"
            >
              Beranda
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center gap-1 pl-2 lg:flex xl:gap-2 xl:pl-3" aria-label="Navigasi utama">
              {navItems.slice(1, -1).map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={`rounded-full px-3 py-2 text-sm text-white transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white xl:px-4 ${
                    isActive(item.href) ? "bg-accent font-bold" : "hover:bg-white/10 hover:text-[#FFF3A8]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                className={`ml-auto rounded-full border px-4 py-2 text-sm font-bold text-white transition active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white xl:px-5 ${
                  isActive("/login")
                    ? "border-accent bg-accent"
                    : "border-white/25 hover:border-white/45 hover:bg-white/10"
                }`}
              >
                Log in
              </Link>
            </nav>

            <button
              type="button"
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
              aria-label="Buka menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>

          <Link
            href="/#beranda"
            onClick={() => handleNavigation("/#beranda")}
            className="grid h-[52px] w-[52px] shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-white p-2 shadow-[0_10px_26px_rgba(52,64,84,0.13)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink lg:h-16 lg:w-16"
            aria-label="Identitas Kabinet Dipanegara"
          >
            <Image
              src="/assets/bemundip.png"
              alt="Logo Kabinet Dipanegara"
              width={64}
              height={64}
              priority
              className="h-full w-full object-contain"
            />
          </Link>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] transition duration-300 lg:hidden ${
          isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          aria-label="Tutup menu navigasi"
          tabIndex={isOpen ? 0 : -1}
          onClick={() => setIsOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className={`relative ml-auto flex h-full w-[min(90vw,360px)] flex-col bg-charcoal px-6 pb-8 pt-5 text-white shadow-[-20px_0_60px_rgba(0,0,0,0.22)] transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Image
              src="/assets/bemundip.png"
              alt="Logo Kabinet Dipanegara"
              width={76}
              height={76}
              className="h-[52px] w-[52px] rounded-full bg-white object-contain p-2"
            />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              aria-label="Tutup menu"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="mt-10 flex flex-1 flex-col" aria-label="Navigasi seluler">
            {navItems.map((item, index) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`flex items-center justify-between border-b border-white/15 py-4 text-[1.65rem] leading-none transition hover:text-[#FFF3A8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  isActive(item.href) ? "text-[#FFF3A8]" : "text-white"
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <span>{item.label}</span>
                <span className="font-landing-stat text-sm text-white/45">0{index + 1}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
