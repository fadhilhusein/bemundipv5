import type { Metadata } from "next";
import { AlertCircle, Newspaper, SearchX } from "lucide-react";
import { BidangFigmaHeader } from "@/components/BidangFigmaHeader";
import { Footer } from "@/components/Footer";
import { EditorialFeed } from "@/components/EditorialFeed";
import { HighlightCarousel, type HighlightItem } from "@/components/HighlightCarousel";
import { ListHeader } from "@/components/ListHeader";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { SearchForm } from "@/components/SearchForm";
import { StatePanel } from "@/components/StatePanel";
import { PillPagination } from "@/components/ui/PillPagination";
import { publikasiToFeedItem } from "@/lib/feed-items";
import {
  getPublikasiCount,
  getPublikasiHighlights,
  getPublikasiPaginated,
  getPublikasiSearchCount,
  getPublikasiSearchPaginated,
  type PublikasiRecord
} from "@/lib/publikasi-public";
import { normalizeSearchQuery } from "@/lib/search";

export const metadata: Metadata = {
  title: "Publikasi — BEM UNDIP 2026",
  description: "Berita, rilis kebijakan, dan dokumentasi kegiatan Kabinet BEM UNDIP 2026."
};

const PER_PAGE = 10;
const HIGHLIGHT_COUNT = 5;
const LIST_ANCHOR = "daftar-berita";

type PageProps = {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
};

function parsePage(value: string | string[] | undefined) {
  const page = Math.floor(Number(Array.isArray(value) ? value[0] : value));
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function loadList(query: string, page: number): Promise<[number, PublikasiRecord[]]> {
  return query
    ? Promise.all([getPublikasiSearchCount(query), getPublikasiSearchPaginated(query, page, PER_PAGE)])
    : Promise.all([getPublikasiCount(), getPublikasiPaginated(page, PER_PAGE)]);
}

export default async function PublikasiListingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = normalizeSearchQuery(params.q);
  const requestedPage = parsePage(params.page);
  const isFrontPage = !query && requestedPage === 1;

  let totalCount = 0;
  let list: PublikasiRecord[] = [];
  let highlights: PublikasiRecord[] = [];
  let loadError: string | null = null;

  try {
    [[totalCount, list], highlights] = await Promise.all([
      loadList(query, requestedPage),
      isFrontPage ? getPublikasiHighlights(HIGHLIGHT_COUNT) : Promise.resolve([])
    ]);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Gagal memuat publikasi";
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  if (!loadError && currentPage !== requestedPage && totalCount > 0) {
    try {
      [, list] = await loadList(query, currentPage);
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Gagal memuat publikasi";
      list = [];
    }
  }

  const highlightItems: HighlightItem[] = highlights.map((item) => {
    const card = publikasiToFeedItem(item);
    return { id: card.id, href: card.href, title: card.title, tag: card.tag, meta: card.meta, metaDateTime: card.metaDateTime, image: card.image };
  });

  const summary = query
    ? `${totalCount} berita ditemukan`
    : `${totalCount} berita${totalPages > 1 ? ` · halaman ${currentPage} dari ${totalPages}` : ""}`;

  return (
    <>
      <BidangFigmaHeader active="Publikasi" className="bg-white" />
      <main id="main-content" className="landing-page overflow-hidden pb-20 sm:pb-24">
        <PageHero script="News" title="Berita BEM UNDIP 2026">
          <SearchForm
            action="/publikasi"
            defaultValue={query}
            placeholder="CARI BERITA DI SINI!"
            label="Cari berita berdasarkan judul, isi, atau kategori"
            inputId="cari-berita"
          />
        </PageHero>

        {isFrontPage && highlightItems.length > 0 ? (
          <section aria-labelledby="sorotan-berita" className="landing-container mt-10 sm:mt-14">
            <h2 id="sorotan-berita" className="sr-only">
              Sorotan berita
            </h2>
            <HighlightCarousel items={highlightItems} label="Sorotan berita" ctaLabel="Baca berita" />
          </section>
        ) : null}

        {isFrontPage ? (
          <section aria-labelledby="sambutan-berita" className="landing-container mt-16 sm:mt-24">
            <Reveal>
              <h2
                id="sambutan-berita"
                className="landing-title max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] text-charcoal"
              >
                Kabar terbaru dari Kabinet Dipanegara
              </h2>
              <div className="landing-copy mt-8 max-w-4xl space-y-5 font-landing-copy text-[clamp(1.05rem,1.7vw,1.45rem)] leading-relaxed text-ink/80">
                <p>
                  Di sini kami merangkum kabar dari Kabinet Dipanegara: rilis kebijakan, liputan program kerja, dan
                  dokumentasi kegiatan bidang, biro, serta kantor BEM UNDIP.
                </p>
                <p>Cari berita lewat kolom di atas, atau telusuri arsipnya di bawah. Berita terbaru selalu tampil paling depan.</p>
              </div>
            </Reveal>
          </section>
        ) : null}

        <section
          id={LIST_ANCHOR}
          aria-labelledby="judul-daftar-berita"
          className={`landing-container scroll-mt-28 ${isFrontPage ? "mt-16 sm:mt-24" : "mt-10 sm:mt-14"}`}
        >
          <ListHeader
            titleId="judul-daftar-berita"
            eyebrow="Arsip berita"
            title="Semua berita"
            summary={loadError ? null : summary}
            query={query}
            clearHref="/publikasi"
          />

          {loadError ? (
            <StatePanel
              icon={AlertCircle}
              title="Gagal memuat berita"
              description={`${loadError}. Periksa koneksi lalu coba lagi beberapa saat lagi.`}
              action={{ href: "/publikasi", label: "Coba lagi" }}
            />
          ) : list.length > 0 ? (
            <>
              <div className="mt-8">
                <EditorialFeed items={list.map(publikasiToFeedItem)} />
              </div>
              <PillPagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/publikasi"
                query={{ q: query || undefined }}
                anchor={LIST_ANCHOR}
                label="Halaman berita"
              />
            </>
          ) : query ? (
            <StatePanel
              icon={SearchX}
              title={`Tidak ada berita untuk “${query}”`}
              description="Coba kata kunci lain, misalnya nama kegiatan, bidang, atau kategori berita."
              action={{ href: "/publikasi", label: "Lihat semua berita" }}
            />
          ) : (
            <StatePanel
              icon={Newspaper}
              title="Belum ada berita"
              description="Berita, rilis, dan dokumentasi kegiatan BEM UNDIP akan tampil di sini begitu diterbitkan."
              action={{ href: "/", label: "Kembali ke beranda" }}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
