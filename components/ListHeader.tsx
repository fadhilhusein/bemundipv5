import Link from "next/link";
import { X } from "lucide-react";

type ListHeaderProps = {
  titleId: string;
  eyebrow: string;
  title: string;
  /** Count text such as "12 agenda"; hidden while loading failed. */
  summary: string | null;
  /** Active search keyword; switches the header to the search-result state. */
  query: string;
  /** Page to return to when the search is cleared. */
  clearHref: string;
};

/** Heading above a public listing, shared by the news, agenda, and service pages. */
export function ListHeader({ titleId, eyebrow, title, summary, query, clearHref }: ListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-accent-deep">
          {query ? "Hasil pencarian" : eyebrow}
        </p>
        <h2
          id={titleId}
          className="landing-title mt-3 break-words text-[clamp(2rem,4.4vw,3.25rem)] leading-none text-charcoal [overflow-wrap:anywhere]"
        >
          {query ? `“${query}”` : title}
        </h2>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3 font-sans text-sm text-ink/65">
        {summary ? <p>{summary}</p> : null}
        {query ? (
          <Link
            href={clearHref}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 font-semibold text-charcoal transition hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Hapus pencarian
            <X size={16} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
