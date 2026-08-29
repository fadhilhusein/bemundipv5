import { Megaphone, Newspaper, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

type EmptyPublikasiProps = {
  variant?: "homepage" | "listing";
  className?: string;
};

export function EmptyPublikasi({ variant = "homepage", className = "" }: EmptyPublikasiProps) {
  const isHomepage = variant === "homepage";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-clay/15 bg-white px-6 py-10 text-center shadow-card sm:px-10 sm:py-14 ${className}`}
    >
      {/* warm editorial wash — subtle, no admin feel */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,210,165,0.22),transparent_48%),radial-gradient(circle_at_88%_18%,rgba(217,106,28,0.06),transparent_32%)]" />

      <div className="relative mx-auto max-w-xl">
        {/* aesthetic icon: newspaper + megaphone + search */}
        <div className="mx-auto flex justify-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-orange text-white shadow-card">
            <Newspaper size={24} strokeWidth={1.7} />
          </span>
          <span className="hidden h-14 w-14 place-items-center rounded-full bg-peach/70 text-brown ring-1 ring-clay/15 sm:grid">
            <Megaphone size={22} strokeWidth={1.7} />
          </span>
          <span className="hidden h-14 w-14 place-items-center rounded-full bg-cream text-clay ring-1 ring-clay/20 sm:grid">
            <Search size={20} strokeWidth={1.7} />
          </span>
        </div>

        <h3 className="font-display mt-6 text-2xl font-medium leading-tight text-brown sm:text-3xl">
          {isHomepage ? "Nantikan Publikasi Kami" : "Belum Ada Kabar Terbaru"}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed tracking-wide text-clay sm:text-[15px]">
          Informasi dan kegiatan terbaru dari BEM UNDIP sedang kami siapkan. Nantikan kabar, rilis,
          dan dokumentasi yang akan segera hadir di sini.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={isHomepage ? "/#beranda" : "/"}>Kembali ke Beranda</Button>
          <Button href="/#bidang" variant="secondary">
            Kenali Departemen
          </Button>
          <Button href="/#ruang-gerak" variant="secondary">
            Lihat Layanan Mahasiswa
          </Button>
        </div>

        <p className="mt-5 text-xs font-medium tracking-wide text-clay/60">
          Punya pertanyaan? Hubungi kami melalui kontak di bawah.
        </p>
      </div>
    </div>
  );
}
