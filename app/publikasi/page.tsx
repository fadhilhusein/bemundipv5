import { AlertCircle } from "lucide-react";
import { EmptyPublikasi } from "@/components/EmptyPublikasi";
import { PublikasiCard } from "@/components/PublikasiCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
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

  let totalCount = 0;
  let list: Awaited<ReturnType<typeof getPublikasiPaginated>> = [];
  let loadError: string | null = null;

  try {
    [totalCount, list] = await Promise.all([
      getPublikasiCount(),
      getPublikasiPaginated(currentPage, PER_PAGE),
    ]);
  } catch (e) {
    loadError = e instanceof Error ? e.message : "Gagal memuat publikasi";
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  let finalList = list;
  if (!loadError && currentPage !== safePage && totalCount > 0) {
    try {
      finalList = await getPublikasiPaginated(safePage, PER_PAGE);
    } catch (e) {
      loadError = e instanceof Error ? e.message : "Gagal memuat publikasi";
      finalList = [];
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-cream pb-24 pt-32 lg:pt-40">
        <Container>
          <h1 className="font-display text-center text-[clamp(3rem,9vw,5rem)] font-medium leading-[0.9] text-brown">
            Publikasi
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-medium leading-relaxed tracking-wide text-brown/80 sm:text-base">
            Kumpulan berita, rilis kebijakan, dan dokumentasi kegiatan Kabinet BEM UNDIP 2026.
          </p>

          {loadError ? (
            <div className="mt-12 rounded-3xl border-2 border-red/20 bg-white px-6 py-12 text-center shadow-card sm:px-10">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red/10 text-red">
                <AlertCircle size={28} aria-hidden="true" />
              </div>
              <h3 className="font-display mt-4 text-xl font-bold text-brown">Gagal memuat publikasi</h3>
              <p className="mx-auto mt-2 max-w-md break-words text-sm leading-relaxed text-clay [overflow-wrap:anywhere]">
                {loadError}. Periksa koneksi atau coba lagi dalam beberapa saat.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button href="/publikasi">Coba lagi</Button>
                <Button href="/" variant="secondary">
                  Kembali ke Beranda
                </Button>
              </div>
            </div>
          ) : finalList.length > 0 ? (
            <>
              <h2 className="sr-only">Daftar publikasi</h2>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {finalList.map((publikasi, index) => (
                  <PublikasiCard
                    key={publikasi.id_publikasi}
                    id={publikasi.id_publikasi}
                    judul={publikasi.judul_publikasi}
                    isi={publikasi.isi_publikasi}
                    gambar={publikasi.gambar_publikasi}
                    kategori={publikasi.kategori_publikasi}
                    tanggal={publikasi.tanggal_publikasi}
                    priority={index === 0}
                  />
                ))}
              </div>
              <Pagination currentPage={safePage} totalPages={totalPages} baseHref="/publikasi" anchor="" />
              <p className="mt-4 text-center text-xs font-medium tracking-wide text-clay">
                Menampilkan {finalList.length} dari {totalCount} publikasi
              </p>
            </>
          ) : (
            <>
              <h2 className="sr-only">Daftar publikasi</h2>
              <div className="mt-12">
                <EmptyPublikasi variant="listing" />
              </div>
            </>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
