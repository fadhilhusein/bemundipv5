"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import { useState } from "react";
import { IconTile } from "@/components/IconTile";

export type HighlightKind = "news" | "agenda" | "service";

export type HighlightItem = {
  id: number;
  /** Where the call-to-action leads; null shows an unavailable state. */
  href: string | null;
  /** Opens `href` in a new tab, for links outside this site. */
  external?: boolean;
  title: string;
  /** Pill text, e.g. the news category or the organising bidang. */
  tag: string;
  /** Secondary text next to the pill, e.g. a formatted date or the agenda timeline. */
  meta?: string;
  /** Machine-readable date for `meta`; omit when `meta` is not a date. */
  metaDateTime?: string;
  /** Short description, shown for services where there is no photo to carry the slide. */
  excerpt?: string;
  image: string | null;
};

type HighlightCarouselProps = {
  items: HighlightItem[];
  /** Accessible name of the carousel, e.g. "Sorotan berita". */
  label: string;
  /** Text of the call-to-action that opens the active item. */
  ctaLabel: string;
  kind?: HighlightKind;
};

function SlideImage({
  item,
  sizes,
  kind,
  priority = false
}: {
  item: HighlightItem;
  sizes: string;
  kind: HighlightKind;
  priority?: boolean;
}) {
  if (kind === "service") return <IconTile src={item.image} />;

  if (!item.image) {
    const Icon = kind === "agenda" ? CalendarDays : Newspaper;
    return (
      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-accent to-accent-deep">
        <Icon className="text-white/70" size={56} strokeWidth={1.4} aria-hidden="true" />
      </div>
    );
  }

  return <Image src={item.image} alt="" fill sizes={sizes} priority={priority} className="object-cover" />;
}

function SlideMeta({ item, onImage }: { item: HighlightItem; onImage: boolean }) {
  const metaClass = onImage ? "text-white/80" : "text-ink/65";
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-xs sm:text-sm">
      <span className={`max-w-full truncate rounded-full px-3 py-1 font-semibold text-charcoal ${onImage ? "bg-white/90" : "bg-white"}`}>
        {item.tag}
      </span>
      {item.meta ? (
        item.metaDateTime ? (
          <time dateTime={item.metaDateTime} className={metaClass}>
            {item.meta}
          </time>
        ) : (
          <span className={metaClass}>{item.meta}</span>
        )
      ) : null}
    </div>
  );
}

function CallToAction({ item, label, className }: { item: HighlightItem; label: string; className: string }) {
  if (!item.href) {
    return <span className={`${className} cursor-not-allowed bg-line text-ink/60`}>Segera tersedia</span>;
  }
  const content = (
    <>
      {label}
      <ArrowUpRight size={18} aria-hidden="true" />
      {item.external ? <span className="sr-only"> (buka di tab baru)</span> : null}
    </>
  );
  // accent-deep keeps white text at ~5.5:1 contrast; the lighter accent orange is only ~2.4:1.
  const linkClass = `${className} bg-accent-deep text-white transition hover:bg-orange-ink active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink`;
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {content}
    </a>
  ) : (
    <Link href={item.href} className={linkClass}>
      {content}
    </Link>
  );
}

export function HighlightCarousel({ items, label, ctaLabel, kind = "news" }: HighlightCarouselProps) {
  const [active, setActive] = useState(0);

  if (items.length === 0) return null;

  const count = items.length;
  const hasMany = count > 1;
  const go = (next: number) => setActive((next + count) % count);
  const current = items[active];
  const neighbours = [
    { item: items[(active - 1 + count) % count], step: -1 },
    { item: items[(active + 1) % count], step: 1 }
  ];
  const isService = kind === "service";

  return (
    <div aria-roledescription="carousel" aria-label={label}>
      <p className="sr-only" aria-live="polite">
        Sorotan {active + 1} dari {count}: {current.title}
      </p>

      <div className="relative aspect-[4/5] sm:aspect-[4/3] md:aspect-[1151/735]">
        {neighbours.map(({ item, step }) =>
          hasMany ? (
            <button
              key={step}
              type="button"
              onClick={() => go(active + step)}
              aria-label={`${step < 0 ? "Sorotan sebelumnya" : "Sorotan berikutnya"}: ${item.title}`}
              className={`group absolute top-0 hidden h-full w-[31.3%] overflow-hidden rounded-[44px] bg-line focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink md:block ${
                step < 0 ? "left-0" : "right-0"
              }`}
            >
              <SlideImage item={item} sizes="380px" kind={kind} />
              <span
                className={`absolute inset-0 transition duration-300 ${
                  isService ? "bg-charcoal/15 group-hover:bg-charcoal/5" : "bg-charcoal/40 group-hover:bg-charcoal/25"
                }`}
              />
              <span
                className={`absolute bottom-[14%] grid h-12 w-12 place-items-center rounded-full bg-white text-ink shadow-float transition duration-300 ${
                  step < 0 ? "left-[10%] group-hover:-translate-x-1" : "right-[10%] group-hover:translate-x-1"
                }`}
              >
                {step < 0 ? <ArrowLeft size={20} aria-hidden="true" /> : <ArrowRight size={20} aria-hidden="true" />}
              </span>
            </button>
          ) : (
            <div
              key={step}
              aria-hidden="true"
              className={`absolute top-0 hidden h-full w-[31.3%] rounded-[44px] bg-surface md:block ${step < 0 ? "left-0" : "right-0"}`}
            />
          )
        )}

        <article
          className={`absolute inset-0 z-10 overflow-hidden rounded-[32px] md:inset-auto md:left-1/2 md:top-0 md:h-[93.4%] md:w-[53.4%] md:-translate-x-1/2 md:rounded-[44px] md:ring-[10px] md:ring-white ${
            isService ? "flex flex-col bg-surface" : "bg-line"
          }`}
        >
          {isService ? (
            <>
              <div className="relative min-h-0 flex-1">
                <SlideImage key={current.id} item={current} sizes="480px" kind={kind} />
              </div>
              <div className="p-5 sm:p-7 md:px-9 md:pb-[17%] md:pt-6">
                <SlideMeta item={current} onImage={false} />
                <h3 className="landing-title mt-3 line-clamp-2 break-words text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.05] text-charcoal [overflow-wrap:anywhere]">
                  {current.title}
                </h3>
                {current.excerpt ? (
                  <p className="landing-copy mt-2 line-clamp-2 font-landing-copy text-sm leading-relaxed text-ink/75 sm:text-base">
                    {current.excerpt}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <SlideImage key={current.id} item={current} sizes="(max-width: 767px) calc(100vw - 40px), 640px" kind={kind} priority={active === 0} />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal from-10% via-charcoal/60 via-40% to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:px-10 md:pb-[18%]">
                <SlideMeta item={current} onImage />
                <h3 className="landing-title mt-3 line-clamp-3 break-words text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.05] text-white [overflow-wrap:anywhere]">
                  {current.href && !current.external ? (
                    <Link
                      href={current.href}
                      className="rounded-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {current.title}
                    </Link>
                  ) : (
                    current.title
                  )}
                </h3>
              </div>
            </>
          )}
        </article>

        <div className="absolute bottom-0 left-1/2 z-20 hidden h-[13.4%] w-[37.4%] -translate-x-1/2 items-center rounded-[44px] bg-white px-[2.6%] md:flex">
          <CallToAction
            item={current}
            label={ctaLabel}
            className="flex h-[70%] w-full items-center justify-center gap-2 rounded-full text-base font-bold lg:text-lg"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 md:hidden">
        {hasMany ? (
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Sorotan sebelumnya"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-ink transition hover:border-ink active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
        ) : null}
        <CallToAction
          item={current}
          label={ctaLabel}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-bold"
        />
        {hasMany ? (
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Sorotan berikutnya"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-charcoal active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
