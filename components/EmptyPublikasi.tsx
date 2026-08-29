import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/Button";

type EmptyPublikasiProps = {
  variant?: "homepage" | "listing";
  className?: string;
};

export function EmptyPublikasi({ variant = "homepage", className = "" }: EmptyPublikasiProps) {
  const isHomepage = variant === "homepage";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-clay/15 bg-white px-6 py-12 text-center shadow-card sm:px-10 sm:py-16 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,210,165,0.22),transparent_50%),radial-gradient(circle_at_90%_20%,rgba(217,106,28,0.06),transparent_35%)]" />

      <div className="relative mx-auto max-w-lg">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-peach/50 text-orange ring-8 ring-peach/20">
          <Newspaper size={44} strokeWidth={1.8} />
        </div>

        <h3 className="font-display mt-6 text-2xl font-medium leading-tight text-brown sm:text-3xl">
          {isHomepage ? "Nantikan Publikasi Kami" : "Belum Ada Kabar Terbaru"}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed tracking-wide text-clay sm:text-[15px]">
          Informasi dan kegiatan terbaru dari BEM UNDIP sedang kami siapkan. Nantikan kabar, rilis,
          dan dokumentasi yang akan segera hadir di sini.
        </p>

        <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-3.5">
          <Button href={isHomepage ? "/#beranda" : "/"}>Kembali ke Beranda</Button>
          <Button href="/#bidang" variant="secondary">
            Kenali Departemen
          </Button>
        </div>

        <p className="mt-5 text-xs font-medium tracking-wide text-clay/70">
          Punya pertanyaan? Hubungi kami melalui kontak di bawah.
        </p>
      </div>
    </div>
  );
}
