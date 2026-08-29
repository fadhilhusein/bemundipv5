import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users } from "lucide-react";
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
      <main className="w-full max-w-full overflow-x-hidden bg-[#fffaf4] pb-24 pt-32 lg:pt-40">
        <Container className="max-w-3xl">
          <Link href="/#bidang" className="text-sm font-semibold text-orange hover:underline">
            ← Kembali ke Bidang & Biro
          </Link>

          <h1 className="font-display mt-6 text-[clamp(3rem,9vw,5rem)] font-medium leading-[0.9] text-brown">
            {bidang.nama_bidang}
          </h1>

          {bidang.gambar ? (
            <Image
              src={bidang.gambar}
              alt={`Logo ${bidang.nama_bidang}`}
              width={80}
              height={80}
              sizes="80px"
              className="mt-5 h-20 w-20 rounded-full object-contain"
            />
          ) : null}

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold tracking-wide text-clay">
            <Users size={16} strokeWidth={2} />
            <span>
              {bidang.penanggung_jawab} · {bidang.jumlah_anggota} anggota
            </span>
          </div>

          <p className="mt-8 whitespace-pre-line text-base leading-relaxed tracking-wide text-brown/90">
            {bidang.deskripsi}
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
