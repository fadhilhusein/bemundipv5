import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Shield, User, Users } from "lucide-react";

type BidangCardProps = {
  id: number;
  namaBidang: string;
  deskripsi: string;
  penanggungJawab: string;
  jumlahAnggota: number;
  gambar?: string | null;
};

export function BidangCard({
  id,
  namaBidang,
  deskripsi,
  penanggungJawab,
  jumlahAnggota,
  gambar
}: BidangCardProps) {
  return (
    <Link
      href={`/bidang/${id}`}
      aria-label={`Lihat detail bidang ${namaBidang}, penanggung jawab ${penanggungJawab}, ${jumlahAnggota} anggota`}
      className="group relative flex min-h-full flex-col justify-between overflow-hidden rounded-2xl border-2 border-clay/35 bg-cream p-6 shadow-card transition-all duration-300 motion-reduce:transition-none hover:-translate-y-1.5 hover:border-orange hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brown active:translate-y-0"
    >
      <div>
        <div className="flex items-start gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-divider bg-white/90 shadow-sm transition-transform duration-300 motion-reduce:transition-none group-hover:scale-105">
            {gambar ? (
              <Image
                src={gambar}
                alt={`Logo ${namaBidang}`}
                width={56}
                height={56}
                sizes="56px"
                className="h-full w-full object-contain p-1.5"
              />
            ) : (
              <Shield className="h-6 w-6 text-clay/70" strokeWidth={1.75} aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-left font-display text-xl font-bold leading-snug text-brown transition-colors duration-200 group-hover:text-orange sm:text-2xl">
              {namaBidang}
            </h3>
          </div>
        </div>

        <p className="mt-4 line-clamp-3 text-left text-sm font-normal leading-relaxed text-brown/85 sm:text-[15px]">
          {deskripsi}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3.5 border-t border-divider pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex min-w-0 items-center gap-1.5 font-medium text-brown">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-peach/40 text-clay" aria-hidden="true">
              <User size={12} strokeWidth={2.2} />
            </div>
            <span className="truncate max-w-[150px] sm:max-w-[170px]" title={penanggungJawab}>
              {penanggungJawab}
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-peach/30 px-2.5 py-0.5 font-semibold text-clay">
            <Users size={12} strokeWidth={2} aria-hidden="true" />
            <span>{jumlahAnggota} anggota</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-orange transition-colors duration-200 group-hover:text-brown">
            Lihat Detail Bidang
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-peach/30 text-orange transition-all duration-300 motion-reduce:transition-none group-hover:bg-orange group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-active:scale-95" aria-hidden="true">
            <ArrowUpRight size={16} strokeWidth={2.4} />
          </span>
        </div>
      </div>
    </Link>
  );
}


