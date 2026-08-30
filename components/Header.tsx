"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Departemen", href: "/#bidang" },
  { label: "Publikasi", href: "/#berita" },
  { label: "Agenda", href: "/#agenda" },
  { label: "Layanan", href: "/#kontak" },
  { label: "Log in", href: "/login" }
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-orange/90 shadow-[0_12px_32px_rgba(64,35,18,0.14)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container-shell flex h-16 items-center justify-between border-b border-white/70 text-white lg:h-20">
        <Link
          href="/#beranda"
          className="flex items-center gap-3 focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label="BEM UNDIP beranda"
        >
          <Image
            src="/assets/bemundip.png"
            alt="Kabinet Universitas Diponegoro"
            width={58}
            height={44}
            priority
            className="h-10 w-auto object-contain drop-shadow-md"
          />
          <span className="hidden text-sm font-semibold leading-tight tracking-wide sm:block">
            BEM UNDIP
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="transition hover:-translate-y-0.5 hover:text-peach focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form className="hidden h-10 items-center gap-2 rounded-full border border-white/85 px-4 text-sm lg:flex">
          <label htmlFor="site-search" className="sr-only">
            Cari
          </label>
          <input
            id="site-search"
            placeholder="Cari Apa?"
            className="w-28 bg-transparent text-white placeholder:text-white/85 outline-none"
          />
          <Search aria-hidden="true" size={20} strokeWidth={1.8} />
        </form>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/80 text-white transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:hidden"
          aria-label="Buka menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <Menu size={22} />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[100] h-dvh overflow-hidden bg-orange text-brown transition duration-300 lg:hidden ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-20 shrink-0 items-center justify-between bg-cream px-6 shadow-[0_10px_24px_rgba(64,35,18,0.12)]">
            <Image
              src="/assets/bemundip.png"
              alt="Kabinet Universitas Diponegoro"
              width={90}
              height={68}
              className="h-12 w-auto object-contain"
            />
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-clay/35 bg-white/60 text-brown transition hover:bg-peach/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brown"
              aria-label="Tutup menu"
              onClick={() => setIsOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-start px-6 pb-8 pt-24 text-center">
            {navItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="border-b border-white/60 py-5 text-2xl font-bold leading-none text-brown transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
