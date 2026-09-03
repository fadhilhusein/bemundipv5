import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft, Sparkles, Shield, User, Users } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProgramCard } from "@/components/ProgramCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getBidangById, getProgramUnggulanByBidang } from "@/lib/bidang-public";

type PageProps = {
  params: Promise<{ id: string }>;
};

function parseId(id: string): number | null {
  const numericId = Number(id);
  return Number.isFinite(numericId) ? numericId : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseId(id);
  const bidang = numericId !== null ? await getBidangById(numericId) : null;

  if (!bidang) {
    return { title: "Bidang tidak ditemukan — BEM UNDIP 2026" };
  }

  return {
    title: `${bidang.nama_bidang} — BEM UNDIP 2026`,
    description: bidang.deskripsi
  };
}

export default async function BidangDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) notFound();

  let bidang: Awaited<ReturnType<typeof getBidangById>> = null;
  let programList: Awaited<ReturnType<typeof getProgramUnggulanByBidang>> = [];
  let bidangError: string | null = null;
  let programError: string | null = null;

  try {
    bidang = await getBidangById(numericId);
  } catch (e) {
    bidangError = e instanceof Error ? e.message : "Gagal memuat bidang";
  }
  if (bidangError) {
    return (
      <>
        <Header />
        <main className="w-full max-w-full overflow-x-hidden bg-cream pb-24 pt-32 lg:pt-40">
          <Container className="max-w-4xl">
            <div className="rounded-3xl border-2 border-red/20 bg-white px-6 py-12 text-center shadow-card sm:px-10">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-red/10 text-red">
                <AlertCircle size={28} aria-hidden="true" />
              </div>
              <h1 className="font-display mt-4 text-2xl font-bold text-brown">Gagal memuat bidang</h1>
              <p className="mx-auto mt-2 max-w-md break-words text-sm leading-relaxed text-clay [overflow-wrap:anywhere]">
                {bidangError}. Coba muat ulang halaman.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button href={`/bidang/${numericId}`}>Coba lagi</Button>
                <Button href="/#bidang" variant="secondary">
                  Kembali
                </Button>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }
  if (!bidang) notFound();

  try {
    programList = await getProgramUnggulanByBidang(numericId);
  } catch (e) {
    programError = e instanceof Error ? e.message : "Gagal memuat program unggulan";
  }

  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden bg-cream pb-24 pt-32 lg:pt-40">
        <Container className="max-w-4xl">
          <Link
            href="/#bidang"
            className="group inline-flex items-center gap-2 rounded-full border border-divider bg-white/70 px-4 py-2 text-sm font-semibold text-orange shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-x-0.5 hover:bg-white hover:text-brown focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
          >
            <ArrowLeft size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Kembali ke Bidang & Biro</span>
          </Link>

          {/* Hero Header Section */}
          <div className="mt-8 rounded-3xl border-2 border-clay/30 bg-white/80 p-8 shadow-card backdrop-blur-sm sm:p-10">
            <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-divider bg-cream shadow-inner sm:h-28 sm:w-28">
                {bidang.gambar ? (
                  <Image
                    src={bidang.gambar}
                    alt={`Logo ${bidang.nama_bidang}`}
                    width={96}
                    height={96}
                    sizes="96px"
                    className="h-full w-full object-contain p-2.5"
                    priority
                  />
                ) : (
                  <Shield className="h-12 w-12 text-clay/70" strokeWidth={1.5} aria-hidden="true" />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <span className="inline-block rounded-full bg-peach/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-ink">
                  Bidang & Biro
                </span>
                <h1
                  className="min-w-0 break-words font-display text-3xl font-bold leading-tight text-brown [overflow-wrap:anywhere] [hyphens:auto] sm:text-4xl lg:text-5xl"
                  lang="id"
                  dir="auto"
                  title={bidang.nama_bidang}
                >
                  {bidang.nama_bidang.trim() || "Tanpa nama bidang"}
                </h1>
              </div>
            </div>

            {/* Metadata Pills */}
            <div className="mt-8 flex min-w-0 flex-wrap items-center gap-3 border-t border-divider pt-6 text-sm">
              <div className="flex min-w-0 items-center gap-2 rounded-xl bg-cream px-4 py-2 font-medium text-brown">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach/40 text-clay" aria-hidden="true">
                  <User size={13} strokeWidth={2.2} />
                </div>
                <span className="min-w-0 break-words [overflow-wrap:anywhere]" dir="auto" title={bidang.penanggung_jawab}>
                  Ketua / PIC: <strong className="break-words font-semibold text-brown [overflow-wrap:anywhere]">{bidang.penanggung_jawab.trim() || "—"}</strong>
                </span>
              </div>

              <div className="flex min-w-0 items-center gap-2 rounded-xl bg-cream px-4 py-2 font-medium text-brown">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-peach/40 text-clay" aria-hidden="true">
                  <Users size={13} strokeWidth={2.2} />
                </div>
                <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                  Total Anggota:{" "}
                  <strong className="font-semibold text-brown">
                    {new Intl.NumberFormat("id-ID").format(bidang.jumlah_anggota)} orang
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Deskripsi & Konten */}
          <div className="mt-10 rounded-3xl border-2 border-clay/20 bg-white/60 p-8 shadow-sm sm:p-10">
            <h2
              className="min-w-0 break-words font-display text-xl font-bold text-brown [overflow-wrap:anywhere] sm:text-2xl"
              lang="id"
              dir="auto"
              title={bidang.nama_bidang}
            >
              Tentang {bidang.nama_bidang.trim()}
            </h2>
            <div className="mt-4 h-0.5 w-12 bg-orange-ink" />
            <p
              className="mt-6 min-w-0 whitespace-pre-line break-words text-base leading-relaxed text-brown/90 [overflow-wrap:anywhere] [hyphens:auto] sm:text-lg"
              lang="id"
              dir="auto"
            >
              {bidang.deskripsi?.trim() || "Deskripsi bidang belum tersedia."}
            </p>
          </div>

          {/* Program Unggulan Section */}
          <div className="mt-10 rounded-3xl border-2 border-clay/20 bg-white/60 p-8 shadow-sm sm:p-10">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-peach/40 text-orange-ink">
                <Sparkles size={20} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <h2 className="min-w-0 break-words font-display text-xl font-bold text-brown [overflow-wrap:anywhere] sm:text-2xl">
                Program Unggulan
              </h2>
            </div>
            <div className="mt-4 h-0.5 w-12 bg-orange-ink" />

            {programError ? (
              <div className="mt-6 rounded-2xl border border-red/15 bg-white px-5 py-8 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red/10 text-red">
                  <AlertCircle size={22} aria-hidden="true" />
                </div>
                <p className="mx-auto mt-3 max-w-md break-words text-sm font-semibold leading-relaxed text-brown [overflow-wrap:anywhere]">
                  Gagal memuat program unggulan
                </p>
                <p className="mx-auto mt-1 max-w-md break-words text-xs leading-relaxed text-clay [overflow-wrap:anywhere]">
                  {programError}
                </p>
                <Button href={`/bidang/${numericId}`} variant="secondary" className="mt-4">
                  Coba lagi
                </Button>
              </div>
            ) : programList.length === 0 ? (
              <p className="mt-6 break-words text-sm text-clay [overflow-wrap:anywhere] sm:text-base">
                Belum ada program unggulan yang ditambahkan untuk bidang ini.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {programList.map((program, index) => (
                  <ProgramCard
                    key={program.id_program}
                    nama={program.nama_program}
                    deskripsi={program.deskripsi_program}
                    gambar={program.gambar_program}
                    tanggalWaktu={program.tanggal_waktu_program}
                    priority={index === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

