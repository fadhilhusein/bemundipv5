import Link from "next/link";
import { CalendarX2 } from "lucide-react";

export function EmptyAgenda() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-clay/35 bg-white/50 p-12 text-center shadow-inner sm:p-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-peach/40 text-orange shadow-sm" aria-hidden="true">
        <CalendarX2 size={32} strokeWidth={1.75} />
      </div>
      <h3 className="font-display mt-6 text-2xl font-bold text-brown sm:text-3xl">
        Belum Ada Agenda
      </h3>
      <p className="mt-2.5 max-w-md text-sm font-medium leading-relaxed text-brown/80 sm:text-base">
        Jadwal kegiatan, program kerja, dan agenda Kabinet BEM UNDIP 2026 akan segera dipublikasikan di sini.
      </p>
      <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/agenda"
          className="inline-flex items-center gap-2 rounded-full border-2 border-clay/40 bg-white/70 px-6 py-2.5 text-sm font-semibold text-brown shadow-sm transition-all duration-200 hover:border-orange hover:bg-white hover:text-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
        >
          Buka Halaman Agenda
        </Link>
      </div>
    </div>
  );
}
