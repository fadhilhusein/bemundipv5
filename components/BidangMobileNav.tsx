"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type NavItem = { label: string; href: string };

type BidangMobileNavProps = {
  items: readonly NavItem[];
  active: string;
};

/** Phone version of the orange navbar: a compact pill with a hamburger that opens a slide-in menu. */
export function BidangMobileNav({ items, active }: BidangMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const trigger = triggerRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }
      // Keep keyboard focus inside the open menu.
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  // Close if the viewport grows to the desktop layout while the menu is open.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const onChange = () => query.matches && setIsOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="md:hidden">
      <div className="mx-auto flex h-14 w-full items-center gap-3 rounded-full border border-white bg-[#b84b00] p-1.5 pr-2 font-display text-white shadow-[0_4px_2px_rgba(0,0,0,0.25)]">
        <Link
          href="/#beranda"
          aria-label="BEM UNDIP beranda"
          className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Image src="/assets/bemundip.png" alt="" width={44} height={44} className="h-full w-full object-contain" />
        </Link>
        <span className="min-w-0 flex-1 truncate text-base">{active}</span>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Buka menu navigasi"
          aria-expanded={isOpen}
          aria-controls="menu-navigasi-seluler"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </div>

      <div
        className={`fixed inset-0 z-[70] transition ${isOpen ? "visible" : "pointer-events-none invisible"}`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Tutup menu navigasi"
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-charcoal/45 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          ref={panelRef}
          id="menu-navigasi-seluler"
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi"
          className={`absolute inset-y-0 right-0 flex w-[min(86vw,340px)] flex-col rounded-l-[32px] border-l border-white/40 bg-[#b84b00] px-5 pb-8 pt-5 font-display text-white shadow-[-20px_0_60px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-white p-1.5">
                <Image src="/assets/bemundip.png" alt="" width={44} height={44} className="h-full w-full object-contain" />
              </span>
              <span className="truncate text-lg">BEM UNDIP 2026</span>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup menu"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/40 transition hover:bg-white/15 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Navigasi seluler" className="mt-8 flex flex-col gap-2">
            {items.map((item) => {
              const isActive = item.label === active;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`flex min-h-14 items-center rounded-full border px-6 text-xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive ? "border-[#21005d] bg-[#fd853a]" : "border-transparent hover:bg-white/15"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="mt-auto pt-8 font-sans text-xs text-white/70">Kabinet Dipanegara · BEM Universitas Diponegoro</p>
        </div>
      </div>
    </div>
  );
}
