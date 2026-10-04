import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PillPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  /** Extra query params to keep on every page link, e.g. the search keyword. */
  query?: Record<string, string | undefined>;
  /** Element id to jump to after navigating, without the leading "#". */
  anchor?: string;
  label?: string;
};

const WINDOW_SIZE = 5;

function buildHref(basePath: string, page: number, query: PillPaginationProps["query"], anchor?: string) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const search = params.toString();
  return `${basePath}${search ? `?${search}` : ""}${anchor ? `#${anchor}` : ""}`;
}

function getWindow(currentPage: number, totalPages: number) {
  let start = Math.max(1, currentPage - Math.floor(WINDOW_SIZE / 2));
  const end = Math.min(totalPages, start + WINDOW_SIZE - 1);
  start = Math.max(1, end - WINDOW_SIZE + 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

const stepClass =
  "grid h-11 w-11 place-items-center rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
const pageClass =
  "grid h-11 min-w-11 place-items-center rounded-full px-3 font-landing-stat text-base tabular-nums transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function PillPagination({
  currentPage,
  totalPages,
  basePath,
  query,
  anchor,
  label = "Navigasi halaman"
}: PillPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getWindow(currentPage, totalPages);
  const first = pages[0];
  const last = pages[pages.length - 1];
  const href = (page: number) => buildHref(basePath, page, query, anchor);

  const renderPage = (page: number) =>
    page === currentPage ? (
      <span key={page} aria-current="page" className={`${pageClass} bg-charcoal text-white`}>
        {page}
      </span>
    ) : (
      <Link key={page} href={href(page)} aria-label={`Halaman ${page}`} className={`${pageClass} text-ink hover:bg-white`}>
        {page}
      </Link>
    );

  return (
    <nav aria-label={label} className="mt-12 flex justify-center sm:mt-16">
      <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-1 rounded-full bg-charcoal/[0.07] p-1.5">
        {currentPage > 1 ? (
          <Link href={href(currentPage - 1)} aria-label="Halaman sebelumnya" className={`${stepClass} text-ink hover:bg-white`}>
            <ChevronLeft size={20} aria-hidden="true" />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${stepClass} text-ink/30`}>
            <ChevronLeft size={20} />
          </span>
        )}

        {first > 1 ? (
          <>
            {renderPage(1)}
            {first > 2 ? <span className="px-1 text-ink/45" aria-hidden="true">…</span> : null}
          </>
        ) : null}

        {pages.map(renderPage)}

        {last < totalPages ? (
          <>
            {last < totalPages - 1 ? <span className="px-1 text-ink/45" aria-hidden="true">…</span> : null}
            {renderPage(totalPages)}
          </>
        ) : null}

        {currentPage < totalPages ? (
          <Link href={href(currentPage + 1)} aria-label="Halaman berikutnya" className={`${stepClass} bg-ink text-white hover:bg-charcoal`}>
            <ChevronRight size={20} aria-hidden="true" />
          </Link>
        ) : (
          <span aria-hidden="true" className={`${stepClass} text-ink/30`}>
            <ChevronRight size={20} />
          </span>
        )}
      </div>
    </nav>
  );
}
