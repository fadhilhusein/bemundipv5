import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { BidangFigmaFooter } from "@/components/BidangFigmaFooter";
import { BidangFigmaHeader } from "@/components/BidangFigmaHeader";
import { BidangFigmaPage } from "@/components/BidangFigmaPage";
import { Button } from "@/components/ui/Button";
import { getAnggotaByBidang, getBidangById, getProgramUnggulanByBidang } from "@/lib/bidang-public";

type PageProps = {
  params: Promise<{ id: string }>;
};

function parseId(id: string): number | null {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseId(id);
  const bidang = numericId !== null ? await getBidangById(numericId) : null;

  if (!bidang) return { title: "Bidang tidak ditemukan — BEM UNDIP 2026" };

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
  let anggotaList: Awaited<ReturnType<typeof getAnggotaByBidang>> = [];
  let bidangError: string | null = null;
  let programError: string | null = null;
  let anggotaError: string | null = null;

  try {
    bidang = await getBidangById(numericId);
  } catch (error) {
    bidangError = error instanceof Error ? error.message : "Gagal memuat bidang";
  }

  if (bidangError) {
    return (
      <>
        <BidangFigmaHeader />
        <main className="bg-[#f5f5f5] px-5 py-20">
          <div className="mx-auto max-w-3xl rounded-3xl border border-red/20 bg-white px-6 py-12 text-center shadow-card sm:px-10">
            <AlertCircle className="mx-auto text-red" size={38} aria-hidden="true" />
            <h1 className="mt-5 font-display text-3xl font-bold text-brown">Gagal memuat bidang</h1>
            <p className="mt-3 text-sm leading-relaxed text-clay">{bidangError}. Coba muat ulang halaman.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href={`/bidang/${numericId}`}>Coba lagi</Button>
              <Button href="/#bidang" variant="secondary">Kembali</Button>
            </div>
          </div>
        </main>
        <BidangFigmaFooter />
      </>
    );
  }

  if (!bidang) notFound();

  try {
    [programList, anggotaList] = await Promise.all([
      getProgramUnggulanByBidang(numericId),
      getAnggotaByBidang(numericId)
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat data bidang";
    programError = message;
    anggotaError = message;
  }

  return (
    <>
      <BidangFigmaHeader />
      <BidangFigmaPage
        bidang={bidang}
        numericId={numericId}
        programList={programList}
        programError={programError}
        anggotaList={anggotaList}
        anggotaError={anggotaError}
      />
      <BidangFigmaFooter />
    </>
  );
}
