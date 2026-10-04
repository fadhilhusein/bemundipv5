import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BidangFigmaHeader } from "@/components/BidangFigmaHeader";
import { DetailBody, DetailHeader, DetailPill } from "@/components/DetailHeader";
import { Footer } from "@/components/Footer";
import { RelatedList } from "@/components/RelatedList";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { publikasiToFeedItem } from "@/lib/feed-items";
import { formatTanggal, toIsoDate } from "@/lib/format-date";
import { getPublikasiById, getPublikasiPaginated } from "@/lib/publikasi-public";

type PageProps = {
  params: Promise<{ id: string }>;
};

const RELATED_COUNT = 3;

function parseId(id: string): number | null {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseId(id);
  const publikasi = numericId !== null ? await getPublikasiById(numericId) : null;

  if (!publikasi) {
    return { title: "Publikasi tidak ditemukan — BEM UNDIP 2026" };
  }

  return {
    title: `${String(publikasi.judul_publikasi ?? "").trim() || "Tanpa judul"} — BEM UNDIP 2026`,
    description: String(publikasi.isi_publikasi ?? "").slice(0, 160)
  };
}

export default async function PublikasiDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) notFound();

  const [publikasi, latest] = await Promise.all([
    getPublikasiById(numericId),
    getPublikasiPaginated(1, RELATED_COUNT + 1).catch(() => [])
  ]);
  if (!publikasi) notFound();

  const title = String(publikasi.judul_publikasi ?? "").trim() || "Tanpa judul";
  const date = formatTanggal(publikasi.tanggal_publikasi);
  const related = latest
    .filter((item) => item.id_publikasi !== publikasi.id_publikasi)
    .slice(0, RELATED_COUNT)
    .map(publikasiToFeedItem);

  return (
    <>
      <BidangFigmaHeader active="Publikasi" className="bg-white" />
      <main id="main-content" className="landing-page overflow-hidden pb-20 sm:pb-24">
        <article className="landing-container">
          <DetailHeader
            backHref="/publikasi"
            backLabel="Kembali ke Berita"
            title={title}
            pills={<DetailPill>{publikasi.kategori_publikasi?.trim() || "Publikasi"}</DetailPill>}
            meta={date ? <time dateTime={toIsoDate(publikasi.tanggal_publikasi)}>{date}</time> : null}
          />

          {publikasi.gambar_publikasi ? (
            <div className="mt-10">
              <ImageLightbox
                src={publikasi.gambar_publikasi}
                alt={title}
                backdrop
                wrapperClassName="relative mx-auto aspect-[4/5] w-[min(100%,560px,64vh)] overflow-hidden rounded-[28px] bg-charcoal shadow-float"
                imageClassName="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                roundedClass="rounded-[28px]"
                priority
                quality={82}
              />
            </div>
          ) : null}

          <DetailBody text={String(publikasi.isi_publikasi ?? "").trim()} emptyText="Konten publikasi belum tersedia." />
        </article>

        <RelatedList
          id="berita-lainnya"
          eyebrow="Baca juga"
          title="Berita lainnya"
          items={related}
          kind="news"
          moreHref="/publikasi"
          moreLabel="Lihat semua berita"
        />
      </main>
      <Footer />
    </>
  );
}
