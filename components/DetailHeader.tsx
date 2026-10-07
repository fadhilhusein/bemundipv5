import { BackLink } from "@/components/BackLink";

type DetailHeaderProps = {
  backHref: string;
  backLabel: string;
  /** Pills above the title, e.g. category or status. */
  pills: React.ReactNode;
  title: string;
  /** Line under the title, e.g. the publication date. */
  meta?: React.ReactNode;
};

/** Top of a detail page in the landing style: back link, pills, large title, meta line. */
export function DetailHeader({ backHref, backLabel, pills, title, meta }: DetailHeaderProps) {
  return (
    <header className="mx-auto max-w-3xl">
      <BackLink href={backHref}>{backLabel}</BackLink>
      <div className="mt-8 flex flex-wrap items-center gap-2 font-sans text-xs sm:text-sm">{pills}</div>
      <h1
        className="landing-title mt-4 break-words text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.04] text-charcoal [overflow-wrap:anywhere]"
        lang="id"
        dir="auto"
      >
        {title}
      </h1>
      {meta ? <div className="mt-4 font-sans text-sm text-ink/65">{meta}</div> : null}
    </header>
  );
}

export function DetailPill({ children, className = "bg-surface text-charcoal" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex rounded-full px-3 py-1 font-semibold ${className}`}>{children}</span>;
}

/** Long-form text block (description or article body). Keeps the admin's line breaks. */
export function DetailBody({ heading, text, emptyText }: { heading?: string; text: string; emptyText: string }) {
  return (
    <section className="mx-auto mt-10 max-w-3xl" aria-label={heading}>
      {heading ? <h2 className="landing-title text-2xl text-charcoal sm:text-3xl">{heading}</h2> : null}
      <p
        className={`landing-copy whitespace-pre-line break-words font-landing-copy text-base leading-8 text-ink/85 [overflow-wrap:anywhere] sm:text-lg ${heading ? "mt-4" : ""}`}
        lang="id"
        dir="auto"
      >
        {text || emptyText}
      </p>
    </section>
  );
}
