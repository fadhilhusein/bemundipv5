"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

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

export function LandingNewsCarousel({ items }: LandingNewsCarouselProps) {
  const pages = useMemo(() => {
    const grouped: LandingNewsItem[][] = [];
    for (let index = 0; index < items.length; index += 2) grouped.push(items.slice(index, index + 2));
    return grouped;
  }, [items]);
  const [activePage, setActivePage] = useState(0);

  if (pages.length === 0) return null;

  const goTo = (next: number) => {
    setActivePage((next + pages.length) % pages.length);
  };

  return (
    <div className="mt-9 sm:mt-10">
      <div className="relative">
        <div className="grid gap-6 sm:grid-cols-2" aria-live="polite">
          {pages[activePage].map((item, index) => (
            <article
              key={item.id}
              className={`${index === 1 ? "hidden sm:block" : "block"} group min-w-0`}
            >
              <Link
                href={`/publikasi/${item.id}`}
                className="block rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                <div className="relative aspect-video overflow-hidden rounded-[22px] bg-[#D9D9D9] shadow-[0_16px_38px_rgba(52,64,84,0.09)]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      priority={activePage === 0 && index === 0}
                      className="object-cover transition duration-500 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="grid h-full place-items-center bg-surface px-6 text-center text-sm text-muted">
                      Dokumentasi publikasi segera hadir
                    </div>
                  )}
                  <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-ink transition group-hover:-translate-y-1 group-hover:translate-x-1 sm:bottom-4 sm:right-4">
                    <Image
                      src="/assets/landing/arrow-up-right.svg"
                      alt=""
                      width={28}
                      height={28}
                      className="h-5 w-5"
                    />
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-sm text-ink/70">
                  <span className="rounded-full bg-surface px-4 py-2 text-charcoal">
                    {item.category || "Publikasi"}
                  </span>
                  <span>{formatDate(item.date)}</span>
                </div>
                <h3 className="landing-copy mt-4 max-w-xl text-[clamp(1.45rem,2.5vw,2rem)] leading-tight text-ink transition group-hover:text-accent-deep">
                  {item.title}
                </h3>
                {item.excerpt ? (
                  <p className="landing-copy mt-3 line-clamp-2 font-sans text-sm leading-relaxed text-ink/65">
                    {item.excerpt}
                  </p>
                ) : null}
              </Link>
            </article>
          ))}
        </div>

        {pages.length > 1 ? (
          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-2" aria-label="Pilih halaman berita">
              {pages.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActivePage(index)}
                  aria-label={`Tampilkan berita halaman ${index + 1}`}
                  aria-current={activePage === index ? "true" : undefined}
                  className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${
                    activePage === index ? "w-12 bg-accent" : "w-2.5 bg-line hover:bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goTo(activePage - 1)}
                aria-label="Berita sebelumnya"
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition hover:border-ink hover:bg-ink hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <ArrowLeft size={19} />
              </button>
              <button
                type="button"
                onClick={() => goTo(activePage + 1)}
                aria-label="Berita berikutnya"
                className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition hover:bg-accent-deep active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                <ArrowRight size={19} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
