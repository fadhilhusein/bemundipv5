import Link from "next/link";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

type PublikasiCardProps = {
  id: number;
  judul: string;
  isi: string;
  gambar: string | null;
  kategori: string | null;
  tanggal: string;
};

function formatTanggal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export function PublikasiCard({ id, judul, isi, gambar, kategori, tanggal }: PublikasiCardProps) {
  return (
    <div className="group flex min-h-[330px] flex-col rounded-xl border-2 border-clay bg-cream p-5 shadow-card transition duration-[250ms] hover:-translate-y-1.5 hover:shadow-card-hover">
      {gambar ? (
        <div className="mb-5">
          <ImageLightbox
            src={gambar}
            alt={judul}
            wrapperClassName="relative aspect-video w-full overflow-hidden rounded-sm border border-clay/40 bg-cream"
            imageClassName="object-contain p-1"
            sizes="(max-width: 768px) 100vw, 33vw"
            roundedClass="rounded-sm"
          />
        </div>
      ) : (
        <div className="mb-5 grid aspect-video place-items-center rounded-sm border border-clay/40 bg-[#d7d7d7] text-sm font-semibold tracking-widest text-brown/55 transition group-hover:bg-peach/60">
          /foto dokum/
        </div>
      )}
      <Link
        href={`/publikasi/${id}`}
        className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brown"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-clay">
          {kategori ? `${kategori} · ` : ""}
          {formatTanggal(tanggal)}
        </p>
        <h3 className="mt-2 text-2xl font-bold leading-tight text-orange transition-colors group-hover:text-brown">{judul}</h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm font-medium leading-relaxed tracking-wide text-brown sm:text-[15px]">
          {isi}
        </p>
        <span className="mt-3 text-sm font-bold text-orange underline-offset-4 group-hover:underline">
          Baca selengkapnya →
        </span>
      </Link>
    </div>
  );
}