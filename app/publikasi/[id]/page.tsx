import type { Metadata } from "next";
import Link from "next/link";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
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

function formatTanggal(value: unknown): string {
  if (value == null) return "Tanggal tidak tersedia";
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "Tanggal tidak tersedia";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(value);
    } catch {
      return value.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
  }
  if (typeof value === "string") {
    const normalized = value.trim();
    if (!normalized) return "Tanggal tidak tersedia";
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return normalized;
    try {
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(date);
    } catch {
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }
  }
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return String(value);
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(date);
  } catch {
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseId(id);
  const publikasi = numericId !== null ? await getPublikasiById(numericId) : null;

  if (!publikasi) {
    return { title: "Publikasi tidak ditemukan — BEM UNDIP 2026" };
  }

  return {
    title: `${String(publikasi.judul_publikasi ?? "").trim() || "Tanpa judul"} — BEM UNDIP 2026`,
    description: String(publikasi.isi_publikasi ?? "").slice(0, 160),
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
      <main className="w-full max-w-full overflow-x-hidden bg-cream pb-24 pt-32 lg:pt-40">
        <Container className="max-w-3xl">
          <Link href="/#berita" className="text-sm font-semibold text-orange-ink hover:text-brown hover:underline">
            ← Kembali ke Berita
          </Link>

          {publikasi.kategori_publikasi ? (
            <p
              className="mt-6 min-w-0 break-words text-xs font-semibold uppercase tracking-widest text-clay [overflow-wrap:anywhere] [hyphens:auto]"
              lang="id"
              dir="auto"
              title={publikasi.kategori_publikasi}
            >
              <span className="line-clamp-2 break-words">{String(publikasi.kategori_publikasi).trim()}</span>
            </p>
          ) : null}

          <h1
            className="font-display mt-3 min-w-0 break-words text-[clamp(2.4rem,7vw,4rem)] font-medium leading-[0.95] text-brown [overflow-wrap:anywhere] [hyphens:auto]"
            lang="id"
            dir="auto"
            title={String(publikasi.judul_publikasi ?? "")}
          >
            {String(publikasi.judul_publikasi ?? "").trim() || "Tanpa judul"}
          </h1>

          <p className="mt-4 min-w-0 break-words text-sm font-semibold text-clay [overflow-wrap:anywhere]">
            {formatTanggal(publikasi.tanggal_publikasi)}
          </p>

          {publikasi.gambar_publikasi ? (
            <div className="mt-8">
              <ImageLightbox
                src={publikasi.gambar_publikasi}
                alt={publikasi.judul_publikasi}
                wrapperClassName="relative aspect-video w-full overflow-hidden rounded-2xl border border-clay/40 bg-cream shadow-sm"
                imageClassName="object-contain p-1"
                sizes="(max-width: 768px) 100vw, 768px"
                roundedClass="rounded-2xl"
                priority
                quality={82}
              />
            </div>
          ) : null}

          <p
            className="mt-8 min-w-0 whitespace-pre-line break-words text-base leading-relaxed tracking-wide text-brown/90 [overflow-wrap:anywhere] [hyphens:auto]"
            lang="id"
            dir="auto"
          >
            {String(publikasi.isi_publikasi ?? "").trim() || "Konten publikasi belum tersedia."}
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}