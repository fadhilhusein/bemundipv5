import { Calendar, Sparkles } from "lucide-react";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

type ProgramCardProps = {
  nama: string;
  deskripsi?: string | null;
  gambar?: string | null;
  tanggalWaktu?: string | Date | null;
  priority?: boolean;
};

function formatDatetime(val: unknown) {
  if (val == null) return "—";
  if (val instanceof Date) {
    if (Number.isNaN(val.getTime())) return "—";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(val);
    } catch {
      return val.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
  }
  if (typeof val === "string") {
    const normalized = val.trim();
    if (!normalized) return "—";
    const d = new Date(normalized);
    if (Number.isNaN(d.getTime())) return normalized;
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(d);
    } catch {
      return normalized;
    }
  }
  const d = new Date(val as string | number | Date);
  if (Number.isNaN(d.getTime())) return String(val);
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(d);
  } catch {
    return String(val);
  }
}

export function ProgramCard({ nama, deskripsi, gambar, tanggalWaktu, priority = false }: ProgramCardProps) {
  const safeNama = (typeof nama === "string" ? nama.trim() : String(nama ?? "").trim()) || "Program tanpa nama";
  const safeDeskripsi = typeof deskripsi === "string" ? deskripsi.trim() : deskripsi != null ? String(deskripsi).trim() : "";

  return (
    <div
      className="group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl border-2 border-clay/35 bg-white p-6 shadow-card transition-all duration-300 motion-reduce:transition-none hover:-translate-y-1.5 hover:border-orange-ink/40 hover:shadow-card-hover [content-visibility:auto] [contain-intrinsic-size:auto_380px]"
    >
      <div className="min-w-0">
        {gambar ? (
          <ImageLightbox
            src={gambar}
            alt={`Foto ${safeNama}`}
            wrapperClassName="relative aspect-video w-full overflow-hidden rounded-xl border border-divider bg-cream"
            imageClassName="object-contain p-1"
            sizes="(max-width: 768px) 100vw, 400px"
            roundedClass="rounded-xl"
            priority={priority}
            quality={priority ? 82 : 72}
          />
        ) : (
          <div
            className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-xl border border-divider bg-cream text-clay/60"
            aria-hidden="true"
          >
            <Sparkles className="h-10 w-10 stroke-[1.5]" />
          </div>
        )}

        <h3
          className="mt-5 line-clamp-2 min-w-0 break-words font-display text-xl font-bold leading-snug text-brown [overflow-wrap:anywhere] [hyphens:auto] transition-colors duration-200 group-hover:text-orange-ink sm:text-2xl"
          lang="id"
          dir="auto"
          title={safeNama}
        >
          {safeNama}
        </h3>

        {tanggalWaktu ? (
          <div className="mt-2.5 flex min-w-0 items-center gap-2 text-xs font-semibold text-clay">
            <Calendar size={14} className="shrink-0 text-orange-ink" aria-hidden="true" />
            <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]" title={tanggalWaktu ? String(tanggalWaktu) : undefined}>
              {formatDatetime(tanggalWaktu)}
            </span>
          </div>
        ) : null}

        {safeDeskripsi ? (
          <p
            className="mt-3 line-clamp-6 min-w-0 whitespace-pre-line break-words text-sm leading-relaxed text-brown/80 [overflow-wrap:anywhere] [hyphens:auto]"
            lang="id"
            dir="auto"
            title={safeDeskripsi.slice(0, 200)}
          >
            {safeDeskripsi}
          </p>
        ) : (
          <p className="mt-3 min-w-0 break-words text-sm italic leading-relaxed text-clay/60 [overflow-wrap:anywhere]">
            Deskripsi program belum tersedia.
          </p>
        )}
      </div>
    </div>
  );
}
