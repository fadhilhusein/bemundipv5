import Image from "next/image";
import { Calendar, MapPin, ExternalLink, Sparkles } from "lucide-react";

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
};

const statusLabels: Record<string, { label: string; bg: string; text: string }> = {
  akan_datang: { label: "Akan Datang", bg: "bg-orange/15", text: "text-orange" },
  berlangsung: { label: "Sedang Berlangsung", bg: "bg-emerald-100", text: "text-emerald-800" },
  selesai: { label: "Selesai", bg: "bg-stone-200", text: "text-stone-700" },
  dibatalkan: { label: "Dibatalkan", bg: "bg-red/15", text: "text-red" }
};

export function AgendaCard({
  judul,
  namaBidang,
  deskripsi,
  timeline,
  lokasi,
  poster,
  linkPendaftaran,
  status
}: AgendaCardProps) {
  const statusMeta = statusLabels[status] ?? {
    label: status.replace(/_/g, " "),
    bg: "bg-peach/30",
    text: "text-clay"
  };

  return (
    <article className="group flex min-h-full flex-col justify-between overflow-hidden rounded-2xl border border-divider bg-white/90 p-6 shadow-card backdrop-blur-sm transition-all duration-300 motion-reduce:transition-none hover:-translate-y-1 hover:border-orange/50 hover:shadow-card-hover">
      <div>
        {poster ? (
          <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden rounded-xl border border-divider bg-cream shadow-inner">
            <Image
              src={poster}
              alt={`Poster ${judul}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusMeta.bg} ${statusMeta.text}`}>
            <Sparkles size={11} aria-hidden="true" />
            {statusMeta.label}
          </span>
          {namaBidang ? (
            <span className="truncate rounded-full border border-divider bg-cream/80 px-2.5 py-0.5 text-[11px] font-semibold text-clay">
              {namaBidang}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3.5 font-display text-xl font-bold leading-snug text-brown transition-colors duration-200 group-hover:text-orange sm:text-2xl">
          {judul}
        </h3>

        {deskripsi ? (
          <p className="mt-2.5 line-clamp-3 text-sm font-normal leading-relaxed text-brown/80 sm:text-[15px]">
            {deskripsi}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-divider pt-4 text-xs font-medium text-brown">
        {timeline ? (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach/40 text-clay" aria-hidden="true">
              <Calendar size={13} strokeWidth={2} />
            </div>
            <span className="truncate text-brown/90">{timeline}</span>
          </div>
        ) : null}

        {lokasi ? (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach/40 text-clay" aria-hidden="true">
              <MapPin size={13} strokeWidth={2} />
            </div>
            <span className="truncate text-brown/90">{lokasi}</span>
          </div>
        ) : null}

        {linkPendaftaran ? (
          <div className="pt-2">
            <a
              href={linkPendaftaran}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Daftar atau akses agenda ${judul} (buka di tab baru)`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-200 hover:bg-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            >
              <span>Daftar / Akses Agenda</span>
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}
