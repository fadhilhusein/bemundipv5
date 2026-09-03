import Image from "next/image";
import Link from "next/link";

type PublikasiCardProps = {
  id: number;
  judul: string;
  isi: string;
  gambar: string | null;
  kategori: string | null;
  tanggal: string | Date;
  priority?: boolean;
};

function formatTanggal(value: unknown): string {
  if (value == null) return "Tanggal tidak tersedia";
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "Tanggal tidak tersedia";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(value);
    } catch {
      return value.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
  }
  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return "Tanggal tidak tersedia";
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return normalized;
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(date);
    } catch {
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
  }
  // number, etc. (Neon may return Date or numeric timestamp)
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return String(value);
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(date);
  } catch {
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }
}

export function PublikasiCard({ id, judul, isi, gambar, kategori, tanggal, priority = false }: PublikasiCardProps) {
  const safeJudul = (typeof judul === "string" ? judul.trim() : String(judul ?? "").trim()) || "Tanpa judul";
  const safeIsi = typeof isi === "string" ? isi.trim() : String(isi ?? "").trim();
  const safeKategori = typeof kategori === "string" ? kategori.trim() : kategori != null ? String(kategori).trim() : "";

  return (
    <article
      className="group flex min-h-[330px] min-w-0 flex-col overflow-hidden rounded-xl border-2 border-clay bg-cream p-6 shadow-card transition duration-[250ms] hover:-translate-y-1.5 hover:shadow-card-hover focus-within:border-orange-ink/40 focus-within:shadow-card-hover [content-visibility:auto] [contain-intrinsic-size:auto_420px]"
      style={{ contain: "content" }}
    >
      <Link
        href={`/publikasi/${id}`}
        aria-label={`Baca selengkapnya: ${safeJudul.slice(0, 80)}`}
        className="flex min-w-0 flex-1 flex-col rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brown"
      >
        {gambar ? (
          <div className="relative mb-5 aspect-video w-full min-w-0 overflow-hidden rounded-lg border border-clay/40 bg-cream">
            <Image
              src={gambar}
              alt={safeJudul}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={priority}
              quality={priority ? 82 : 72}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div
            className="mb-5 grid aspect-video place-items-center overflow-hidden rounded-lg border border-dashed border-divider bg-white px-3 text-center text-sm font-semibold tracking-widest text-clay transition group-hover:bg-peach/20"
            aria-hidden="true"
          >
            <span className="break-words [overflow-wrap:anywhere]">Dokumentasi Publikasi</span>
          </div>
        )}
        <p
          className="min-w-0 break-words text-xs font-semibold uppercase tracking-widest text-clay [overflow-wrap:anywhere] [hyphens:auto]"
          lang="id"
          dir="auto"
          title={safeKategori || undefined}
        >
          <span className="line-clamp-1">
            {safeKategori ? `${safeKategori} · ` : ""}
            {formatTanggal(tanggal)}
          </span>
        </p>
        <h3
          className="mt-2 line-clamp-2 min-w-0 break-words font-display text-2xl font-bold leading-tight text-brown [overflow-wrap:anywhere] [hyphens:auto] transition-colors group-hover:text-orange-ink"
          lang="id"
          dir="auto"
          title={safeJudul}
        >
          {safeJudul}
        </h3>
        {safeIsi ? (
          <p
            className="mt-3 line-clamp-3 min-w-0 flex-1 break-words text-sm font-medium leading-relaxed tracking-wide text-brown [overflow-wrap:anywhere] [hyphens:auto] sm:text-[15px]"
            lang="id"
            dir="auto"
            title={safeIsi.slice(0, 160)}
          >
            {safeIsi}
          </p>
        ) : (
          <p className="mt-3 min-w-0 flex-1 break-words text-sm font-medium italic leading-relaxed tracking-wide text-clay [overflow-wrap:anywhere]">
            Deskripsi belum tersedia.
          </p>
        )}
        <span className="mt-3 inline-flex min-w-0 items-center gap-1 break-words text-sm font-bold text-orange-ink underline-offset-4 group-hover:underline [overflow-wrap:anywhere]">
          Baca selengkapnya{" "}
          <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>
    </article>
  );
}