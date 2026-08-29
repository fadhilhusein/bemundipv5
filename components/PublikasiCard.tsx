import Image from "next/image";
import Link from "next/link";

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
    <Link
      href={`/publikasi/${id}`}
      className="group flex min-h-[330px] flex-col rounded-xl border-2 border-clay bg-cream p-5 shadow-card transition duration-[250ms] hover:-translate-y-1.5 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brown"
    >
      {gambar ? (
        <Image
          src={gambar}
          alt={judul}
          width={640}
          height={360}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="mb-5 aspect-video w-full rounded-sm border border-clay/40 object-cover"
        />
      ) : (
        <div className="mb-5 grid aspect-video place-items-center rounded-sm border border-clay/40 bg-[#d7d7d7] text-sm font-semibold tracking-widest text-brown/55 transition group-hover:bg-peach/60">
          /foto dokum/
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-widest text-clay">
        {kategori ? `${kategori} · ` : ""}
        {formatTanggal(tanggal)}
      </p>
      <h3 className="mt-2 text-2xl font-bold leading-tight text-orange">{judul}</h3>
      <p className="mt-3 line-clamp-3 flex-1 text-sm font-medium leading-relaxed tracking-wide text-brown sm:text-[15px]">
        {isi}
      </p>
      <span className="mt-3 text-sm font-bold text-orange underline-offset-4 group-hover:underline">
        Baca selengkapnya →
      </span>
    </Link>
  );
}