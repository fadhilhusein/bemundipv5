import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Shield, User, Users } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/ui/Container";
import { getBidangById } from "@/lib/bidang-public";

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

  const bidang = await getBidangById(numericId);
  if (!bidang) notFound();

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
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
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

              <div className="flex-1 space-y-3">
                <span className="inline-block rounded-full bg-peach/40 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange">
                  Bidang & Biro
                </span>
                <h1 className="font-display text-3xl font-bold leading-tight text-brown sm:text-4xl lg:text-5xl">
                  {bidang.nama_bidang}
                </h1>
              </div>
            </div>

            {/* Metadata Pills */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-divider pt-6 text-sm">
              <div className="flex items-center gap-2 rounded-xl bg-cream px-4 py-2 font-medium text-brown">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-peach/40 text-clay" aria-hidden="true">
                  <User size={13} strokeWidth={2.2} />
                </div>
                <span>
                  Ketua / PIC: <strong className="font-semibold text-brown">{bidang.penanggung_jawab}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-cream px-4 py-2 font-medium text-brown">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-peach/40 text-clay" aria-hidden="true">
                  <Users size={13} strokeWidth={2.2} />
                </div>
                <span>
                  Total Anggota: <strong className="font-semibold text-brown">{bidang.jumlah_anggota} orang</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Deskripsi & Konten */}
          <div className="mt-10 rounded-3xl border-2 border-clay/20 bg-white/60 p-8 shadow-sm sm:p-10">
            <h2 className="font-display text-xl font-bold text-brown sm:text-2xl">
              Tentang {bidang.nama_bidang}
            </h2>
            <div className="mt-4 h-0.5 w-12 bg-orange" />
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-brown/90 sm:text-lg">
              {bidang.deskripsi}
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

