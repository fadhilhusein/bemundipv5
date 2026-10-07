import type { Metadata } from "next";
import { AlertCircle, CalendarX2, SearchX } from "lucide-react";
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
import { getAgendaWithStatus, type AgendaWithStatus } from "@/lib/agenda-public";
import { AGENDA_STATUS_META } from "@/lib/agenda-status";
import { agendaToFeedItem } from "@/lib/feed-items";
import { normalizeSearchQuery, searchItems } from "@/lib/search";

export const metadata: Metadata = {
  title: "Agenda Kegiatan — BEM UNDIP 2026",
  description: "Jadwal kegiatan, program kerja, dan agenda mahasiswa Kabinet BEM UNDIP 2026."
};

const PER_PAGE = 10;
const HIGHLIGHT_COUNT = 5;
const LIST_ANCHOR = "daftar-agenda";

type PageProps = {
  searchParams: Promise<{ page?: string | string[]; q?: string | string[] }>;
};

function parsePage(value: string | string[] | undefined) {
  const page = Math.floor(Number(Array.isArray(value) ? value[0] : value));
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function AgendaListingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = normalizeSearchQuery(params.q);
  const requestedPage = parsePage(params.page);

  let agendas: AgendaWithStatus[] = [];
  let loadError: string | null = null;

  try {
    agendas = await getAgendaWithStatus();
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Gagal memuat agenda";
  }

  // Status depends on today's date, so searching, ordering and paging happen here instead of in SQL.
  const results = searchItems(
    agendas,
    query,
    (agenda) => agenda.judul_agenda,
    (agenda) => [agenda.deskripsi_program, agenda.nama_bidang, agenda.lokasi, agenda.timeline_agenda, AGENDA_STATUS_META[agenda.status].label]
  );
  const totalCount = results.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const list = results.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const isFrontPage = !query && currentPage === 1;
  const upcoming = agendas.filter((agenda) => agenda.status === "akan_datang");

  // Agendas with a poster lead the carousel; the sort is stable, so input order is kept within each group.
  const highlightSource = [...upcoming].sort((a, b) => Number(!a.poster_agenda) - Number(!b.poster_agenda));
  const highlightItems: HighlightItem[] = highlightSource.slice(0, HIGHLIGHT_COUNT).map((agenda) => {
    const card = agendaToFeedItem(agenda);
    return { id: card.id, href: card.href, title: card.title, tag: card.tag, meta: card.meta, image: card.image };
  });

  const pageInfo = totalPages > 1 ? ` · halaman ${currentPage} dari ${totalPages}` : "";
  const summary = query
    ? `${totalCount} agenda ditemukan${pageInfo}`
    : `${totalCount} agenda · ${upcoming.length} akan datang${pageInfo}`;

  return (
    <>
      <BidangFigmaHeader active="Agenda" className="bg-white" />
      <main id="main-content" className="landing-page overflow-hidden pb-20 sm:pb-24">
        <PageHero script="Agenda" title="Agenda BEM UNDIP 2026">
          <SearchForm
            action="/agenda"
            defaultValue={query}
            placeholder="CARI AGENDA DI SINI!"
            label="Cari agenda berdasarkan judul, bidang, lokasi, atau waktu"
            inputId="cari-agenda"
          />
        </PageHero>

        {isFrontPage && highlightItems.length > 0 ? (
          <section aria-labelledby="agenda-mendatang" className="landing-container mt-10 sm:mt-14">
            <h2 id="agenda-mendatang" className="sr-only">
              Agenda akan datang
            </h2>
            <HighlightCarousel items={highlightItems} label="Agenda akan datang" ctaLabel="Lihat detail" kind="agenda" />
          </section>
        ) : null}

        {isFrontPage ? (
          <section aria-labelledby="sambutan-agenda" className="landing-container mt-16 sm:mt-24">
            <Reveal>
              <h2
                id="sambutan-agenda"
                className="landing-title max-w-4xl text-[clamp(2.25rem,5vw,4.5rem)] leading-[1] text-charcoal"
              >
                Temukan kegiatan dan ikut bergerak bersama
              </h2>
              <div className="landing-copy mt-8 max-w-4xl space-y-5 font-landing-copy text-[clamp(1.05rem,1.7vw,1.45rem)] leading-relaxed text-ink/80">
                <p>
                  Di sini kamu bisa menemukan forum, kelas publik, dan program kerja dari bidang, biro, serta kantor
                  Kabinet Dipanegara BEM UNDIP.
                </p>
                <p>
                  {highlightItems.length > 0
                    ? "Agenda yang akan datang tampil di sorotan di atas. Buka detailnya untuk membaca deskripsi lengkap, lokasi, dan cara mendaftar."
                    : "Belum ada agenda yang akan datang saat ini. Agenda yang sudah berlalu tetap bisa kamu lihat di daftar di bawah."}
                </p>
              </div>
            </Reveal>
          </section>
        ) : null}

        <section
          id={LIST_ANCHOR}
          aria-labelledby="judul-daftar-agenda"
          className={`landing-container scroll-mt-8 ${isFrontPage ? "mt-16 sm:mt-24" : "mt-10 sm:mt-14"}`}
        >
          <ListHeader
            titleId="judul-daftar-agenda"
            eyebrow="Kalender kegiatan"
            title="Semua agenda"
            summary={loadError ? null : summary}
            query={query}
            clearHref="/agenda"
          />

          {loadError ? (
            <StatePanel
              icon={AlertCircle}
              title="Gagal memuat agenda"
              description={`${loadError}. Periksa koneksi lalu coba lagi beberapa saat lagi.`}
              action={{ href: "/agenda", label: "Coba lagi" }}
            />
          ) : list.length > 0 ? (
            <>
              <div className="mt-8">
                <EditorialFeed items={list.map(agendaToFeedItem)} kind="agenda" readMoreLabel="Lihat detail" />
              </div>
              <PillPagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath="/agenda"
                query={{ q: query || undefined }}
                anchor={LIST_ANCHOR}
                label="Halaman agenda"
              />
            </>
          ) : query ? (
            <StatePanel
              icon={SearchX}
              title={`Tidak ada agenda untuk “${query}”`}
              description="Coba kata kunci lain, misalnya nama kegiatan, bidang, lokasi, atau bulan pelaksanaan."
              action={{ href: "/agenda", label: "Lihat semua agenda" }}
            />
          ) : (
            <StatePanel
              icon={CalendarX2}
              title="Belum ada agenda"
              description="Jadwal kegiatan, program kerja, dan agenda Kabinet BEM UNDIP 2026 akan tampil di sini begitu dipublikasikan."
              action={{ href: "/", label: "Kembali ke beranda" }}
            />
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
