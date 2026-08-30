import { EmptyPublikasi } from "@/components/EmptyPublikasi";
import { PublikasiCard } from "@/components/PublikasiCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import { getPublikasiCount, getPublikasiPaginated } from "@/lib/publikasi-public";

const PER_PAGE = 9;

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PublikasiListingPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const [totalCount, list] = await Promise.all([
    getPublikasiCount(),
    getPublikasiPaginated(currentPage, PER_PAGE),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const finalList = currentPage !== safePage && totalCount > 0
    ? await getPublikasiPaginated(safePage, PER_PAGE)
    : list;

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-[#fffaf4] pb-24 pt-32 lg:pt-40">
        <Container>
          <h1 className="font-display text-center text-[clamp(3rem,9vw,5rem)] font-medium leading-[0.9] text-brown">
            Publikasi
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-medium leading-relaxed tracking-wide text-brown/80 sm:text-base">
            Kumpulan berita, rilis kebijakan, dan dokumentasi kegiatan Kabinet BEM UNDIP 2026.
          </p>

          {finalList.length > 0 ? (
            <>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {finalList.map((publikasi) => (
                  <PublikasiCard
                    key={publikasi.id_publikasi}
                    id={publikasi.id_publikasi}
                    judul={publikasi.judul_publikasi}
                    isi={publikasi.isi_publikasi}
                    gambar={publikasi.gambar_publikasi}
                    kategori={publikasi.kategori_publikasi}
                    tanggal={publikasi.tanggal_publikasi}
                  />
                ))}
              </div>
              <Pagination currentPage={safePage} totalPages={totalPages} baseHref="/publikasi" anchor="" />
              <p className="mt-4 text-center text-xs font-medium tracking-wide text-clay">
                Menampilkan {finalList.length} dari {totalCount} publikasi
              </p>
            </>
          ) : (
            <div className="mt-12">
              <EmptyPublikasi variant="listing" />
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
