import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { AgendaCard } from "@/components/AgendaCard";
import { EmptyAgenda } from "@/components/EmptyAgenda";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import { getAgendaCount, getAgendaPaginated } from "@/lib/agenda-public";

export const metadata: Metadata = {
  title: "Agenda Kegiatan — BEM UNDIP 2026",
  description: "Jadwal kegiatan, program kerja, dan agenda mahasiswa Kabinet BEM UNDIP 2026."
};

const PER_PAGE = 9;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AgendaListingPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  let totalCount = 0;
  let list: Awaited<ReturnType<typeof getAgendaPaginated>> = [];
  let loadError: string | null = null;

  try {
    [totalCount, list] = await Promise.all([
      getAgendaCount(),
      getAgendaPaginated(currentPage, PER_PAGE),
    ]);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Gagal memuat agenda";
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  let finalList = list;
  if (!loadError && currentPage !== safePage && totalCount > 0) {
    try {
      finalList = await getAgendaPaginated(safePage, PER_PAGE);
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Gagal memuat agenda";
      finalList = [];
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-cream pb-24 pt-32 lg:pt-40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-peach/40 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange">
              Kalender Kegiatan
            </span>
            <h1 className="font-display mt-4 text-[clamp(3rem,9vw,5rem)] font-medium leading-[0.9] text-brown">
              Agenda Kabinet
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-medium leading-relaxed tracking-wide text-brown/80 sm:text-base">
              Rangkaian program, lokakarya, forum, dan kegiatan mahasiswa yang diselenggarakan oleh BEM UNDIP 2026.
            </p>
          </div>

          {loadError ? (
            <div className="mt-12 rounded-3xl border-2 border-red/20 bg-white px-6 py-12 text-center shadow-card sm:px-10">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red/10 text-red">
                <AlertCircle size={28} aria-hidden="true" />
              </div>
              <h3 className="font-display mt-4 text-xl font-bold text-brown">Gagal memuat agenda</h3>
              <p className="mx-auto mt-2 max-w-md break-words text-sm leading-relaxed text-clay [overflow-wrap:anywhere]">
                {loadError}. Periksa koneksi atau coba lagi.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button href="/agenda">Coba lagi</Button>
                <Button href="/" variant="secondary">
                  Kembali ke Beranda
                </Button>
              </div>
            </div>
          ) : finalList.length > 0 ? (
            <>
              <h2 className="sr-only">Daftar agenda</h2>
              <div className="mt-12 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {finalList.map((agenda, index) => (
                  <AgendaCard
                    key={agenda.id_agenda}
                    id={agenda.id_agenda}
                    judul={agenda.judul_agenda}
                    namaBidang={agenda.nama_bidang}
                    deskripsi={agenda.deskripsi_program}
                    timeline={agenda.timeline_agenda}
                    lokasi={agenda.lokasi}
                    poster={agenda.poster_agenda}
                    linkPendaftaran={agenda.link_pendaftaran}
                    status={agenda.status_agenda}
                    priority={index === 0}
                  />
                ))}
              </div>
              <Pagination currentPage={safePage} totalPages={totalPages} baseHref="/agenda" anchor="" />
              <p className="mt-4 text-center text-xs font-medium tracking-wide text-clay">
                Menampilkan {finalList.length} dari {totalCount} agenda
              </p>
            </>
          ) : (
            <>
              <h2 className="sr-only">Daftar agenda</h2>
              <div className="mt-12">
                <EmptyAgenda />
              </div>
            </>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
