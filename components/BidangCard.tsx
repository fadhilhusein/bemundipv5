import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";

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
      className="group flex min-h-full flex-col rounded-xl border-2 border-clay bg-cream p-5 shadow-card transition duration-[250ms] hover:-translate-y-1.5 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brown"
    >
      {gambar ? (
        <Image
          src={gambar}
          alt={`Logo ${namaBidang}`}
          width={64}
          height={64}
          sizes="64px"
          className="mx-auto mb-4 h-16 w-16 rounded-full object-contain"
        />
      ) : null}
      <h3 className="text-center text-2xl font-bold leading-[1.05] text-orange sm:text-3xl">
        {namaBidang}
      </h3>
      <p className="mt-4 line-clamp-3 flex-1 text-center text-sm font-medium leading-relaxed tracking-wide text-brown sm:text-[15px]">
        {deskripsi}
      </p>
      <div className="mt-5 flex items-center justify-center gap-1.5 text-xs font-semibold tracking-wide text-clay">
        <Users size={14} strokeWidth={2} />
        <span>
          {penanggungJawab} · {jumlahAnggota} anggota
        </span>
      </div>
      <span className="mt-3 text-center text-sm font-bold text-orange underline-offset-4 group-hover:underline">
        Lihat detail →
      </span>
    </Link>
  );
}
