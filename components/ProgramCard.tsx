import Image from "next/image";
import { Calendar, Sparkles } from "lucide-react";

type ProgramCardProps = {
  nama: string;
  deskripsi?: string | null;
  gambar?: string | null;
  tanggalWaktu?: string | null;
};

function formatDatetime(val: string) {
  try {
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch {
    return val;
  }
}

export function ProgramCard({ nama, deskripsi, gambar, tanggalWaktu }: ProgramCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-clay/35 bg-white p-6 shadow-card transition-all duration-300 motion-reduce:transition-none hover:-translate-y-1 hover:border-orange hover:shadow-card-hover">
      <div>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-divider bg-cream">
          {gambar ? (
            <Image
              src={gambar}
              alt={`Foto ${nama}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-clay/60">
              <Sparkles className="h-10 w-10 stroke-[1.5]" />
            </div>
          )}
        </div>

        <h3 className="mt-5 font-display text-xl font-bold leading-snug text-brown transition-colors duration-200 group-hover:text-orange sm:text-2xl">
          {nama}
        </h3>

        {tanggalWaktu ? (
          <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-clay">
            <Calendar size={14} className="text-orange" />
            <span>{formatDatetime(tanggalWaktu)}</span>
          </div>
        ) : null}

        {deskripsi ? (
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brown/80">
            {deskripsi}
          </p>
        ) : null}
      </div>
    </div>
  );
}
