import {
  Calendar,
  MapPin,
  ExternalLink,
  Sparkles,
  Radio,
  CheckCircle2,
  XCircle,
  ImageOff,
} from "lucide-react";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

type AgendaCardProps = {
  id: number;
  judul: string;
  namaBidang?: string | null;
  deskripsi?: string | null;
  timeline?: string | null;
  lokasi?: string | null;
  poster?: string | null;
  linkPendaftaran?: string | null;
  status: string;
  priority?: boolean;
};

type StatusMeta = {
  label: string;
  bg: string;
  text: string;
  border?: string;
  Icon: React.ElementType;
};

const statusConfig: Record<string, StatusMeta> = {
  akan_datang: {
    label: "Akan Datang",
    bg: "bg-orange-soft",
    text: "text-orange-ink",
    Icon: Sparkles,
  },
  berlangsung: {
    label: "Sedang Berlangsung",
    bg: "bg-peach",
    text: "text-brown",
    Icon: Radio,
  },
  selesai: {
    label: "Selesai",
    bg: "bg-divider",
    text: "text-brown",
    border: "border border-clay/10",
    Icon: CheckCircle2,
  },
  dibatalkan: {
    label: "Dibatalkan",
    bg: "bg-red/[0.08]",
    text: "text-red",
    border: "border border-red/15",
    Icon: XCircle,
  },
};

export function AgendaCard({
  judul,
  namaBidang,
  deskripsi,
  timeline,
  lokasi,
  poster,
  linkPendaftaran,
  status,
  priority = false,
}: AgendaCardProps) {
  const statusMeta: StatusMeta =
    statusConfig[status] ?? {
      label: status.replace(/_/g, " "),
      bg: "bg-peach/30",
      text: "text-clay",
      Icon: Sparkles,
    };

  const StatusIcon = statusMeta.Icon;
  const isCancelled = status === "dibatalkan";
  const isEnded = status === "selesai";
  const isArchived = isCancelled || isEnded;

  const safeJudul =
    (typeof judul === "string" ? judul.trim() : String(judul ?? "").trim()) ||
    "Tanpa judul";
  const safePoster =
    typeof poster === "string"
      ? poster.trim()
      : poster
        ? String(poster).trim()
        : "";
  const toDisplayText = (v: unknown): string => {
    if (v == null) return "";
    if (v instanceof Date) {
      try {
        return new Intl.DateTimeFormat("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        }).format(v);
      } catch {
        return v.toLocaleDateString("id-ID");
      }
    }
    if (typeof v === "string") return v.trim();
    return String(v).trim();
  };

  return (
    <article
      className="flex min-h-full min-w-0 flex-col justify-between overflow-hidden rounded-2xl border border-clay/15 bg-white p-5 shadow-card transition-shadow duration-300 [content-visibility:auto] [contain-intrinsic-size:auto_480px] hover:shadow-card-hover sm:p-6"
    >
      <div className="min-w-0">
        {safePoster ? (
          <div className="mb-5 min-w-0">
            <ImageLightbox
              src={safePoster}
              alt={`Poster ${safeJudul}`}
              priority={priority}
              quality={priority ? 82 : 74}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              wrapperClassName="relative block aspect-[4/3] w-full overflow-hidden rounded-xl border border-clay/10 bg-cream"
              imageClassName="object-cover object-top"
              roundedClass="rounded-xl"
            />
          </div>
        ) : (
          <div
            className="mb-5 grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-xl border border-dashed border-clay/20 bg-cream/70 p-6 text-center"
            aria-hidden="true"
          >
            <div className="flex max-w-[220px] flex-col items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-peach/40 text-clay">
                <ImageOff size={18} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-clay">
                Poster belum tersedia
              </span>
              <span className="text-[11px] font-medium leading-snug text-clay/60">
                Ilustrasi agenda akan tampil di sini saat panitia mengunggah
                poster
              </span>
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 break-words rounded-full px-3 py-1 text-left text-[11px] font-bold uppercase tracking-wider [overflow-wrap:anywhere] [hyphens:auto] ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border ?? ""}`}
            title={statusMeta.label}
          >
            <StatusIcon
              size={11}
              aria-hidden="true"
              className="shrink-0"
              strokeWidth={isCancelled || isEnded ? 2 : 2.25}
            />
            {status === "berlangsung" ? (
              <span
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-ink"
                aria-hidden="true"
              />
            ) : null}
            <span className="line-clamp-1 break-words">
              {statusMeta.label}
            </span>
          </span>
          {namaBidang ? (
            <span
              className="inline-flex max-w-full items-center break-words rounded-full border border-divider bg-cream px-2.5 py-1 text-[11px] font-semibold leading-none text-clay [overflow-wrap:anywhere] [hyphens:auto]"
              title={namaBidang}
            >
              <span className="line-clamp-1 break-words text-left">
                {namaBidang}
              </span>
            </span>
          ) : null}
        </div>

        <h3
          className="mt-3.5 line-clamp-2 min-w-0 break-words font-display text-xl font-bold leading-snug text-brown [overflow-wrap:anywhere] [hyphens:auto] sm:text-2xl"
          lang="id"
          dir="auto"
          title={safeJudul}
        >
          {safeJudul}
        </h3>

        {deskripsi ? (
          <p
            className="mt-2.5 line-clamp-3 min-w-0 break-words text-sm font-normal leading-relaxed text-brown/75 [overflow-wrap:anywhere] [hyphens:auto] sm:text-[15px]"
            lang="id"
            dir="auto"
            title={String(deskripsi).slice(0, 160)}
          >
            {toDisplayText(deskripsi) || "—"}
          </p>
        ) : (
          <p className="mt-2.5 min-w-0 break-words text-sm font-normal italic leading-relaxed text-clay/60 [overflow-wrap:anywhere]">
            Deskripsi agenda belum tersedia.
          </p>
        )}
      </div>

      <div className="mt-6 flex min-w-0 flex-col gap-3 border-t border-divider pt-4 text-xs font-medium text-brown">
        {timeline ? (
          <div className="flex min-w-0 items-start gap-2.5">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-peach/40 text-clay"
              aria-hidden="true"
            >
              <Calendar size={13} strokeWidth={2} />
            </span>
            <span
              className="min-w-0 flex-1 break-words pt-1 text-left leading-snug text-brown/90 [overflow-wrap:anywhere]"
              lang="id"
              dir="auto"
              title={String(timeline)}
            >
              <span className="line-clamp-2 break-words">
                {toDisplayText(timeline)}
              </span>
            </span>
          </div>
        ) : null}

        {lokasi ? (
          <div className="flex min-w-0 items-start gap-2.5">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-peach/40 text-clay"
              aria-hidden="true"
            >
              <MapPin size={13} strokeWidth={2} />
            </span>
            <span
              className="min-w-0 flex-1 break-words pt-1 text-left leading-snug text-brown/90 [overflow-wrap:anywhere]"
              lang="id"
              dir="auto"
              title={String(lokasi)}
            >
              <span className="line-clamp-2 break-words">
                {toDisplayText(lokasi)}
              </span>
            </span>
          </div>
        ) : null}

        {linkPendaftaran ? (
          <div className="pt-2">
            {isCancelled ? (
              <span
                className="inline-flex min-h-[44px] w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-red/15 bg-divider px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-clay/70"
                aria-disabled="true"
                title="Pendaftaran untuk agenda ini telah dibatalkan"
              >
                <XCircle size={14} aria-hidden="true" className="shrink-0" />
                <span>Pendaftaran Dibatalkan</span>
              </span>
            ) : isEnded ? (
              <a
                href={linkPendaftaran}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Lihat dokumentasi agenda ${safeJudul} (buka di tab baru)`}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-clay/20 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-brown shadow-sm transition-colors duration-200 hover:border-clay/30 hover:bg-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
              >
                <span>Lihat Dokumentasi</span>
                <ExternalLink
                  size={14}
                  aria-hidden="true"
                  className="shrink-0 text-clay"
                />
              </a>
            ) : (
              <a
                href={linkPendaftaran}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Daftar atau akses agenda ${safeJudul} (buka di tab baru)`}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-orange-ink px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors duration-200 hover:bg-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
              >
                <span>Daftar / Akses Agenda</span>
                <ExternalLink size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        ) : isArchived ? (
          <p className="pt-1 text-center text-[11px] font-medium italic text-clay/60">
            {isCancelled
              ? "Agenda ini telah dibatalkan panitia."
              : "Agenda telah selesai. Menunggu unggahan dokumentasi."}
          </p>
        ) : null}
      </div>
    </article>
  );
}
