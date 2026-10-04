import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FeedImage, type FeedItem, type FeedKind } from "@/components/EditorialFeed";
import { Reveal } from "@/components/Reveal";

type RelatedListProps = {
  /** Heading id for aria-labelledby. */
  id: string;
  eyebrow: string;
  title: string;
  items: FeedItem[];
  kind: FeedKind;
  moreHref: string;
  moreLabel: string;
};

/** "Berita/Agenda/Layanan lainnya" strip at the bottom of a detail page. Renders nothing when empty. */
export function RelatedList({ id, eyebrow, title, items, kind, moreHref, moreLabel }: RelatedListProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={id} className="landing-container mt-20 sm:mt-28">
      <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-accent-deep">{eyebrow}</p>
          <h2 id={id} className="landing-title mt-3 text-[clamp(1.85rem,3.6vw,2.75rem)] leading-none text-charcoal">
            {title}
          </h2>
        </div>
        <Link
          href={moreHref}
          className="inline-flex min-h-11 w-fit items-center gap-1.5 rounded-full border border-line px-4 font-sans text-sm font-semibold text-charcoal transition hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {moreLabel}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 80} className="h-full min-w-0">
            <article className="group relative flex h-full min-w-0 flex-col rounded-[28px] bg-surface p-3 transition duration-300 hover:-translate-y-1 hover:shadow-float focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-ink">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
                <FeedImage item={item} kind={kind} sizes="(max-width: 640px) calc(100vw - 64px), 360px" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col px-2 pb-2 pt-4">
                <div className="flex min-w-0 flex-wrap items-center gap-2 font-sans text-xs">
                  {item.status ? (
                    <span className={`rounded-full px-3 py-1 font-semibold ${item.status.className}`}>{item.status.label}</span>
                  ) : null}
                  <span className="max-w-full truncate rounded-full bg-white px-3 py-1 font-semibold text-charcoal">{item.tag}</span>
                </div>
                <h3 className="landing-title mt-3 line-clamp-2 break-words text-xl leading-snug text-charcoal [overflow-wrap:anywhere]">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:content-[''] focus-visible:outline-none"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </h3>
                {item.meta ? <p className="mt-auto pt-3 font-sans text-xs text-ink/60 sm:text-sm">{item.meta}</p> : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
