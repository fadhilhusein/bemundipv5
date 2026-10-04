import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/ActionLink";
import { BidangFigmaHeader } from "@/components/BidangFigmaHeader";
import { DetailBody, DetailHeader, DetailPill } from "@/components/DetailHeader";
import { Footer } from "@/components/Footer";
import { IconTile } from "@/components/IconTile";
import { RelatedList } from "@/components/RelatedList";
import { layananToFeedItem } from "@/lib/feed-items";
import { getLayananById, getLayananList } from "@/lib/layanan-public";
import { hostOf, toExternalUrl } from "@/lib/url";

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
  const layanan = numericId !== null ? await getLayananById(numericId) : null;

  if (!layanan) {
    return { title: "Layanan tidak ditemukan — BEM UNDIP 2026" };
  }

  return {
    title: `${String(layanan.nama_layanan ?? "").trim() || "Layanan"} — Layanan BEM UNDIP 2026`,
    description: String(layanan.deskripsi_layanan ?? "").slice(0, 160) || undefined
  };
}

export default async function LayananDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) notFound();

  const [layanan, allLayanan] = await Promise.all([getLayananById(numericId), getLayananList().catch(() => [])]);
  if (!layanan) notFound();

  const name = String(layanan.nama_layanan ?? "").trim() || "Layanan tanpa nama";
  const link = toExternalUrl(layanan.link_layanan);
  const host = hostOf(link);
  const related = allLayanan
    .filter((item) => item.id_layanan !== layanan.id_layanan)
    .slice(0, RELATED_COUNT)
    .map(layananToFeedItem);

  return (
    <>
      <BidangFigmaHeader active="Layanan" className="bg-white" />
      <main id="main-content" className="landing-page overflow-hidden pb-20 sm:pb-24">
        <article className="landing-container">
          <DetailHeader
            backHref="/layanan"
            backLabel="Kembali ke Layanan"
            title={name}
            pills={<DetailPill>Layanan</DetailPill>}
            meta={host ? `Diakses melalui ${host}` : null}
          />

          <div className="mx-auto mt-10 aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-[28px] shadow-float">
            <IconTile src={layanan.icon_layanan?.trim() || null} />
          </div>

          <DetailBody heading="Tentang layanan" text={String(layanan.deskripsi_layanan ?? "").trim()} emptyText="Deskripsi layanan belum tersedia." />

          <div className="mx-auto mt-10 max-w-3xl border-t border-line pt-8 font-sans">
            {link ? (
              <>
                <ActionLink href={link} external>
                  Buka layanan
                </ActionLink>
                {host ? <p className="mt-3 text-sm text-ink/60">Kamu akan diarahkan ke {host} di tab baru.</p> : null}
              </>
            ) : (
              <p className="text-sm font-medium text-ink/60">Link layanan segera tersedia.</p>
            )}
          </div>
        </article>

        <RelatedList
          id="layanan-lainnya"
          eyebrow="Mungkin kamu butuh"
          title="Layanan lainnya"
          items={related}
          kind="service"
          moreHref="/layanan"
          moreLabel="Lihat semua layanan"
        />
      </main>
      <Footer />
    </>
  );
}
