import type { Metadata } from "next";
import { AlertCircle, HandHeart, SearchX } from "lucide-react";
import { BidangFigmaHeader } from "@/components/BidangFigmaHeader";
import { EditorialFeed } from "@/components/EditorialFeed";
import { Footer } from "@/components/Footer";
import { HighlightCarousel, type HighlightItem } from "@/components/HighlightCarousel";
import { ListHeader } from "@/components/ListHeader";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SearchForm } from "@/components/SearchForm";
import { StatePanel } from "@/components/StatePanel";
import { PillPagination } from "@/components/ui/PillPagination";
import { layananToFeedItem } from "@/lib/feed-items";
import { getLayananList, type LayananRecord } from "@/lib/layanan-public";
import { normalizeSearchQuery, searchItems } from "@/lib/search";

export const metadata: Metadata = {
  title: "Layanan — BEM UNDIP 2026",
  description: "Layanan BEM UNDIP 2026 untuk mahasiswa: advokasi, aspirasi, informasi, dan dukungan kegiatan."
};

const PER_PAGE = 10;
const HIGHLIGHT_COUNT = 5;
const LIST_ANCHOR = "daftar-layanan";

type PageProps = {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
};

function parsePage(value: string | string[] | undefined) {
  const page = Math.floor(Number(Array.isArray(value) ? value[0] : value));
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function LayananPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = normalizeSearchQuery(params.q);
  const requestedPage = parsePage(params.page);

  let layanan: LayananRecord[] = [];
  let loadError: string | null = null;

  try {
    layanan = await getLayananList();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Gagal memuat layanan";
  }

  const results = searchItems(layanan, query, (item) => item.nama_layanan, (item) => [item.deskripsi_layanan]);
  const totalCount = results.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const list = results.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE).map(layananToFeedItem);
  const isFrontPage = !query && currentPage === 1;
  const pageInfo = totalPages > 1 ? ` · halaman ${currentPage} dari ${totalPages}` : "";
  const summary = query ? `${totalCount} layanan ditemukan${pageInfo}` : `${totalCount} layanan${pageInfo}`;

  const highlightItems: HighlightItem[] = layanan.slice(0, HIGHLIGHT_COUNT).map((item) => {
    const card = layananToFeedItem(item);
    return {
      id: card.id,
      href: card.href,
      title: card.title,
      tag: card.tag,
      meta: card.meta,
      excerpt: card.excerpt,
      image: card.image
    };
  });

  return (
    <>
      <BidangFigmaHeader active="Layanan" className="bg-white" />
      <main id="main-content" className="landing-page overflow-hidden pb-20 sm:pb-24">
        <PageHero script="Layanan" title="Layanan BEM UNDIP 2026">
          <SearchForm
            action="/layanan"
            defaultValue={query}
            placeholder="CARI LAYANAN DI SINI!"
            label="Cari layanan berdasarkan nama atau deskripsi"
            inputId="cari-layanan"
          />
        </PageHero>

        {isFrontPage && highlightItems.length > 0 ? (
          <section aria-labelledby="layanan-unggulan" className="landing-container mt-10 sm:mt-14">
            <h2 id="layanan-unggulan" className="sr-only">
              Layanan unggulan
            </h2>
            <HighlightCarousel items={highlightItems} label="Layanan unggulan" ctaLabel="Lihat detail" kind="service" />
          </section>
        ) : null}

        {isFrontPage ? (
          <section aria-labelledby="sambutan-layanan" className="landing-container mt-16 sm:mt-24">
            <Reveal>
              <h2
                id="sambutan-layanan"
                className="landing-title max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] text-charcoal"
              >
                Layanan untuk kebutuhan mahasiswa UNDIP
              </h2>
              <div className="landing-copy mt-8 max-w-4xl space-y-5 font-landing-copy text-[clamp(1.05rem,1.7vw,1.45rem)] leading-relaxed text-ink/80">
                <p>
                  Layanan BEM UNDIP hadir untuk membantu kebutuhan mahasiswa, mulai dari advokasi akademik, kanal
                  aspirasi, sampai informasi dan dukungan kegiatan.
                </p>
                <p>Pilih layanan di bawah untuk membaca penjelasannya, lalu buka formulir atau kanal resminya dari halaman detail.</p>
              </div>
            </Reveal>
          </section>
        ) : null}

        <section
          id={LIST_ANCHOR}
          aria-labelledby="judul-daftar-layanan"
          className={`landing-container scroll-mt-8 ${isFrontPage ? "mt-16 sm:mt-24" : "mt-10 sm:mt-14"}`}
        >
          <ListHeader
            titleId="judul-daftar-layanan"
            eyebrow="Akses cepat"
            title="Semua layanan"
            summary={loadError ? null : summary}
            query={query}
            clearHref="/layanan"
          />

          {loadError ? (
            <StatePanel
              icon={AlertCircle}
              title="Gagal memuat layanan"
              description={`${loadError}. Periksa koneksi lalu coba lagi beberapa saat lagi.`}
              action={{ href: "/layanan", label: "Coba lagi" }}
            />
          ) : list.length > 0 ? (
            <>
              <div className="mt-8">
                <EditorialFeed items={list} kind="service" readMoreLabel="Lihat detail" />
              </div>
              <PillPagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/layanan"
                query={{ q: query || undefined }}
                anchor={LIST_ANCHOR}
                label="Halaman layanan"
              />
            </>
          ) : query ? (
            <StatePanel
              icon={SearchX}
              title={`Tidak ada layanan untuk “${query}”`}
              description="Coba kata kunci lain, misalnya advokasi, beasiswa, atau aspirasi."
              action={{ href: "/layanan", label: "Lihat semua layanan" }}
            />
          ) : (
            <StatePanel
              icon={HandHeart}
              title="Belum ada layanan"
              description="Layanan BEM UNDIP untuk mahasiswa akan tampil di sini begitu dipublikasikan."
              action={{ href: "/", label: "Kembali ke beranda" }}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
