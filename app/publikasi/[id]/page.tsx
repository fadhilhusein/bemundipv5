import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/ui/Container";
import { getPublikasiById } from "@/lib/publikasi-public";

type PageProps = {
  params: Promise<{ id: string }>;
};

function parseId(id: string): number | null {
  const numericId = Number(id);
  return Number.isFinite(numericId) ? numericId : null;
}

function formatTanggal(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseId(id);
  const publikasi = numericId !== null ? await getPublikasiById(numericId) : null;

  if (!publikasi) {
    return { title: "Publikasi tidak ditemukan — BEM UNDIP 2026" };
  }

  return {
    title: `${publikasi.judul_publikasi} — BEM UNDIP 2026`,
    description: publikasi.isi_publikasi.slice(0, 160)
  };
}

export default async function PublikasiDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) notFound();

  const publikasi = await getPublikasiById(numericId);
  if (!publikasi) notFound();

  return (
    <>
      <Header />
      <main className="w-full max-w-full overflow-x-hidden bg-[#fffaf4] pb-24 pt-32 lg:pt-40">
        <Container className="max-w-3xl">
          <Link href="/#berita" className="text-sm font-semibold text-orange hover:underline">
            ← Kembali ke Berita
          </Link>

          {publikasi.kategori_publikasi ? (
            <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-clay">
              {publikasi.kategori_publikasi}
            </p>
          ) : null}

          <h1 className="font-display mt-3 text-[clamp(2.4rem,7vw,4rem)] font-medium leading-[0.95] text-brown">
            {publikasi.judul_publikasi}
          </h1>

          <p className="mt-4 text-sm font-semibold text-clay">{formatTanggal(publikasi.tanggal_publikasi)}</p>

          {publikasi.gambar_publikasi ? (
            <Image
              src={publikasi.gambar_publikasi}
              alt={publikasi.judul_publikasi}
              width={1024}
              height={576}
              sizes="(max-width: 768px) 100vw, 768px"
              className="mt-8 aspect-video w-full rounded-2xl border border-clay/40 object-cover"
            />
          ) : null}

          <p className="mt-8 whitespace-pre-line text-base leading-relaxed tracking-wide text-brown/90">
            {publikasi.isi_publikasi}
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}