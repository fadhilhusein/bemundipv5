import type { Metadata } from "next";
import { AgendaCard } from "@/components/AgendaCard";
import { EmptyAgenda } from "@/components/EmptyAgenda";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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

  const [totalCount, list] = await Promise.all([
    getAgendaCount(),
    getAgendaPaginated(currentPage, PER_PAGE),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const finalList =
    currentPage !== safePage && totalCount > 0
      ? await getAgendaPaginated(safePage, PER_PAGE)
      : list;

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

          {finalList.length > 0 ? (
            <>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {finalList.map((agenda) => (
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
                  />
                ))}
              </div>
              <Pagination currentPage={safePage} totalPages={totalPages} baseHref="/agenda" anchor="" />
              <p className="mt-4 text-center text-xs font-medium tracking-wide text-clay">
                Menampilkan {finalList.length} dari {totalCount} agenda
              </p>
            </>
          ) : (
            <div className="mt-12">
              <EmptyAgenda />
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
