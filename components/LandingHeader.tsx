"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const items = [
  { label: "Beranda", href: "/#beranda" },
  { label: "Departemen", href: "/#bidang" },
  { label: "Publikasi", href: "/#berita" },
  { label: "Agenda", href: "/agenda" },
  { label: "Layanan", href: "/#layanan" },
  { label: "Log in", href: "/login" }
];

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#beranda");
  const reduceMotion = useReducedMotion();
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncHash = () => setActive(window.location.hash || "#beranda");
    syncHash();
    window.addEventListener("hashchange", syncHash);
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      desktop.removeEventListener("change", onResize);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const triggerElement = trigger.current;
    const backgrounds = [document.querySelector("header.landing-header"), document.querySelector("#main-content"), document.querySelector(".landing-footer")]
      .filter((element): element is HTMLElement => element instanceof HTMLElement);
    const previousInert = backgrounds.map(element => element.inert);
    backgrounds.forEach(element => { element.inert = true; });
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(dialog.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") || []);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      backgrounds.forEach((element, index) => { element.inert = previousInert[index]; });
      const returnTarget = previous?.isConnected && previous.getClientRects().length
        ? previous
        : triggerElement?.getClientRects().length
          ? triggerElement
          : document.querySelector<HTMLElement>(".landing-header a");
      returnTarget?.focus();
    };
  }, [open]);

  function navigate(href: string) {
    if (href.startsWith("/#")) setActive(href.slice(1));
    setOpen(false);
  }

  const navClass = (href: string) => `landing-nav-link ${href === `/${active}` ? "bg-accent text-charcoal hover:bg-accent-deep hover:text-white" : "text-white hover:bg-white/10"}`;

  return (
    <>
      <a href="#main-content" className="landing-skip fixed left-5 top-3 z-[70] -translate-y-24 rounded-full bg-white px-4 py-3 text-ink shadow-float focus:translate-y-0">Lewati ke konten</a>
      <header className="landing-header fixed inset-x-0 top-0 z-50 pt-4">
        <div className="landing-container flex items-center gap-3">
          <div className="flex min-h-[60px] min-w-0 flex-1 items-center rounded-full border border-white/25 bg-charcoal/95 p-2 shadow-float backdrop-blur-xl lg:min-h-[64px]">
            <Link href="/#beranda" onClick={() => navigate("/#beranda")} className={navClass("/#beranda")} aria-current={active === "#beranda" ? "page" : undefined}>Beranda</Link>
            <nav className="hidden min-w-0 flex-1 items-center gap-1 pl-1 lg:flex" aria-label="Navigasi utama">
              {items.slice(1, -1).map(item => <Link key={item.href} href={item.href} onClick={() => navigate(item.href)} className={navClass(item.href)} aria-current={item.href === `/${active}` ? "page" : undefined}>{item.label}</Link>)}
              <Link href="/login" className="landing-nav-link ml-auto border border-white/25 text-white hover:bg-white/10">Log in</Link>
            </nav>
            <button ref={trigger} type="button" className="landing-icon-button ml-auto text-white hover:bg-white/10 lg:hidden" aria-label="Buka menu" aria-expanded={open} aria-controls="landing-menu" onClick={() => setOpen(true)}><Menu size={22} /></button>
          </div>
          <Link href="/#beranda" className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full border border-line bg-white p-2 transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink lg:h-16 lg:w-16" aria-label="Identitas BEM Universitas Diponegoro">
            <Image src="/assets/logo-bem.png" alt="Logo BEM Universitas Diponegoro" width={64} height={64} priority className="h-full w-full object-contain" />
          </Link>
        </div>
        <noscript><nav className="landing-container mt-2 flex flex-wrap gap-2 rounded-2xl bg-charcoal p-3 text-white" aria-label="Navigasi tanpa JavaScript">{items.slice(1).map(item => <a key={item.href} href={item.href} className="landing-nav-link">{item.label}</a>)}</nav></noscript>
      </header>
      <AnimatePresence>
        {open && (
          <DrawerOverlay key="menu" reduceMotion={Boolean(reduceMotion)}>
            <div className="absolute inset-0 bg-black/35" onClick={() => setOpen(false)} aria-hidden="true" />
            <motion.div id="landing-menu" ref={dialog} role="dialog" aria-modal="true" aria-label="Menu navigasi" className="relative ml-auto flex h-[100dvh] w-[min(90vw,380px)] flex-col overflow-y-auto bg-charcoal p-6 text-white" initial={reduceMotion ? false : { x: "100%" }} animate={{ x: 0 }} exit={reduceMotion ? { opacity: 0 } : { x: "100%" }} transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}>
              <div className="flex shrink-0 items-center justify-between">
                <Image src="/assets/logo-bem.png" alt="Logo BEM Universitas Diponegoro" width={52} height={52} className="h-[52px] w-[52px] rounded-full bg-white p-2" />
                <button type="button" className="landing-icon-button border border-white/25 hover:bg-white/10" aria-label="Tutup menu" onClick={() => setOpen(false)}><X size={24} /></button>
              </div>
              <nav className="mt-8 flex flex-col" aria-label="Navigasi seluler">
                {items.map(item => <Link key={item.href} href={item.href} onClick={() => navigate(item.href)} className={`min-h-11 border-b border-white/20 py-4 text-lg font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${item.href === `/${active}` ? "text-[#FFF3A8]" : "text-white hover:text-[#FFF3A8]"}`}>{item.label}</Link>)}
              </nav>
            </motion.div>
          </DrawerOverlay>
        )}
      </AnimatePresence>
    </>
  );
}

function DrawerOverlay({ children, reduceMotion }: { children: React.ReactNode; reduceMotion: boolean }) {
  const present = useIsPresent();
  return (
    <motion.div className="landing-menu fixed inset-0 z-[60]" inert={!present}
      initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}>
      {children}
    </motion.div>
  );
}
