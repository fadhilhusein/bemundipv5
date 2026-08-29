import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  baseHref?: string;
  anchor?: string;
};

function buildHref(baseHref: string, page: number, anchor?: string) {
  const url = page === 1 ? `${baseHref}` : `${baseHref}?page=${page}`;
  return anchor ? `${url}${anchor}` : url;
}

export function Pagination({ currentPage, totalPages, baseHref = "/", anchor = "#berita" }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  // windowed display: max 5 pages centered around current
  const windowSize = 5;
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);
  const visiblePages = pages.slice(start - 1, end);

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildHref(baseHref, Math.max(1, currentPage - 1), anchor)}
        aria-label="Halaman sebelumnya"
        aria-disabled={currentPage === 1}
        className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border-2 px-4 text-sm font-semibold transition ${
          currentPage === 1
            ? "pointer-events-none border-divider text-clay/40"
            : "border-brown text-brown hover:bg-brown hover:text-white"
        }`}
      >
        ‹ Prev
      </Link>

      {start > 1 && (
        <>
          <Link
            href={buildHref(baseHref, 1, anchor)}
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border-2 border-divider bg-white px-3 text-sm font-semibold text-brown hover:border-brown"
          >
            1
          </Link>
          {start > 2 && <span className="px-1 text-clay">…</span>}
        </>
      )}

      {visiblePages.map((page) => (
        <Link
          key={page}
          href={buildHref(baseHref, page, anchor)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border-2 px-3 text-sm font-bold transition ${
            page === currentPage
              ? "border-orange bg-orange text-white shadow-card"
              : "border-divider bg-white text-brown hover:border-brown hover:bg-brown hover:text-white"
          }`}
        >
          {page}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-clay">…</span>}
          <Link
            href={buildHref(baseHref, totalPages, anchor)}
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border-2 border-divider bg-white px-3 text-sm font-semibold text-brown hover:border-brown"
          >
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={buildHref(baseHref, Math.min(totalPages, currentPage + 1), anchor)}
        aria-label="Halaman selanjutnya"
        aria-disabled={currentPage === totalPages}
        className={`inline-flex h-10 min-w-10 items-center justify-center rounded-full border-2 px-4 text-sm font-semibold transition ${
          currentPage === totalPages
            ? "pointer-events-none border-divider text-clay/40"
            : "border-brown text-brown hover:bg-brown hover:text-white"
        }`}
      >
        Next ›
      </Link>
    </nav>
  );
}
