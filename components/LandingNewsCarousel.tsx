"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";

export type LandingNewsItem = {
  id: number;
  title: string;
  excerpt: string;
  image: string | null;
  category: string | null;
  date: string;
};

type LandingNewsCarouselProps = {
  items: LandingNewsItem[];
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Jakarta"
  }).format(date);
}

function subscribeToWidth(onChange: () => void) {
  const query = window.matchMedia("(min-width: 768px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

export function LandingNewsCarousel({ items }: LandingNewsCarouselProps) {
  const twoColumns = useSyncExternalStore(subscribeToWidth, () => window.matchMedia("(min-width: 768px)").matches, () => false);
  const [activeItem, setActiveItem] = useState(0);
  const reduceMotion = useReducedMotion();
  const pageSize = twoColumns ? 2 : 1;
  const pageCount = Math.ceil(items.length / pageSize);
  const activePage = Math.floor(Math.min(activeItem, Math.max(items.length - 1, 0)) / pageSize);
  const start = activePage * pageSize;
  const visibleItems = items.slice(start, start + pageSize);

  if (items.length === 0) return null;

  function goTo(page: number) {
    setActiveItem(((page + pageCount) % pageCount) * pageSize);
  }

  return (
    <section className="mt-8" aria-label="Berita terbaru">
      <motion.div
        key={`${pageSize}-${activePage}`}
        className="grid grid-flow-dense gap-6 md:grid-cols-2"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        {visibleItems.map(item => (
          <motion.article key={item.id} className="group min-w-0" initial={false} animate={{ opacity: [reduceMotion ? 1 : 0.8, 1] }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
            <Link href={`/publikasi/${item.id}`} className="block rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink">
              <div className="relative aspect-video overflow-hidden rounded-[22px] bg-surface">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 88px) / 2), (max-width: 1295px) calc((100vw - 120px) / 2), 588px" className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" />
                ) : (
                  <div className="grid h-full place-items-center px-6 text-center font-landing-copy text-base text-ink">Dokumentasi publikasi segera hadir</div>
                )}
                <span className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-ink">
                  <Image src="/assets/landing/arrow-up-right.svg" alt="" width={20} height={20} className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-landing-ui text-sm text-ink">
                <span className="rounded-full bg-surface px-3 py-2">{item.category || "Publikasi"}</span>
                <span>{formatDate(item.date)}</span>
              </div>
              <h3 className="landing-title mt-4 text-ink transition-colors group-hover:text-accent-deep">{item.title}</h3>
              {item.excerpt && <p className="landing-copy landing-body mt-3 line-clamp-2">{item.excerpt}</p>}
            </Link>
          </motion.article>
        ))}
      </motion.div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">Berita {start + 1}–{Math.min(start + pageSize, items.length)} dari {items.length}</p>
      {pageCount > 1 && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap" role="group" aria-label="Pilih halaman berita">
            {Array.from({ length: pageCount }, (_, index) => (
              <button key={index} type="button" onClick={() => goTo(index)} aria-label={`Tampilkan berita halaman ${index + 1}`} aria-current={activePage === index ? "true" : undefined} className="landing-icon-button text-ink hover:bg-surface">
                <span aria-hidden="true" className={`h-2.5 rounded-full ${activePage === index ? "w-6 bg-accent-deep" : "w-2.5 bg-ink/50"}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => goTo(activePage - 1)} aria-label="Berita sebelumnya" className="landing-icon-button border border-line text-ink hover:bg-ink hover:text-white"><ArrowLeft size={19} /></button>
            <button type="button" onClick={() => goTo(activePage + 1)} aria-label="Berita berikutnya" className="landing-icon-button bg-ink text-white hover:bg-accent-deep"><ArrowRight size={19} /></button>
          </div>
        </div>
      )}
      <noscript>
        <ul className="mt-6 space-y-2 font-landing-ui text-base">
          {items.map(item => <li key={item.id}><a href={`/publikasi/${item.id}`} className="inline-flex min-h-11 items-center text-accent-deep underline">{item.title}</a></li>)}
        </ul>
      </noscript>
    </section>
  );
}
