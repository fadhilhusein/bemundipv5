import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Shield } from "lucide-react";
import { ProgramCard } from "@/components/ProgramCard";
import { BidangAnggotaReceipt } from "@/components/BidangAnggotaReceipt";
import { BidangHeroPanel } from "@/components/BidangHeroPanel";
import { Button } from "@/components/ui/Button";
import type { AnggotaBidangRecord, BidangRecord, ProgramUnggulanRecord } from "@/lib/bidang-public";

type Props = {
  bidang: BidangRecord;
  numericId: number;
  programList: ProgramUnggulanRecord[];
  programError: string | null;
  anggotaList: AnggotaBidangRecord[];
  anggotaError: string | null;
};

function getAcronym(name: string): string {
  const ignored = new Set(["dan", "&", "of", "the", "bidang", "biro"]);
  const initials = name
    .trim()
    .split(/\s+/)
    .filter((word) => !ignored.has(word.toLocaleLowerCase("id-ID")))
    .map((word) => word.replace(/[^A-Za-z0-9]/g, "")[0])
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (initials || "BEM").slice(0, 5);
}

export function BidangFigmaPage({ bidang, numericId, programList, programError, anggotaList, anggotaError }: Props) {
  const name = bidang.nama_bidang.trim() || "Bidang BEM UNDIP";
  const description = bidang.deskripsi?.trim() || "Deskripsi bidang belum tersedia.";
  const acronym = getAcronym(name);
  const quoteUtama = bidang.quote_utama?.trim() || "Tanpa Rencana, Kamu Sampai di Sini.\nBukan seperti kafe. Tapi Warteg";
  const [quoteHeadline, ...quoteSupportingLines] = quoteUtama.split(/\r?\n/).filter(Boolean);
  const quoteSupporting = quoteSupportingLines.join("\n");
  const quotePenutup = bidang.quote_penutup?.trim() || "Cerita-Cerita Bermula di Sini. Beberapa Berakhir Dengan Baik.";

  return (
    <main className="overflow-hidden bg-[#f5f5f5] text-white">
      <section className="bidang-poster mx-auto w-full max-w-[1385px] px-3 sm:px-7 lg:px-10">
        <div className="bidang-hero-title bidang-poster-title">
          <p style={acronym.length > 3 ? { fontSize: `${44 / acronym.length}cqw` } : undefined}>{acronym}</p>
          <h1 className="uppercase">{name}</h1>
          <p>2026</p>
        </div>

        <div className="bidang-poster-store relative pt-[8%]">
          <Image src="/assets/bidang-figma/roof.svg" alt="" width={1529} height={154} priority className="pointer-events-none absolute inset-x-0 top-0 z-20 h-auto w-full" />

          <div className="bidang-photo-mask relative mx-[4.5%] aspect-[2.86/1] overflow-hidden border-x border-black/60 bg-[#fd853a]">
            {bidang.gambar_utama ? (
              <Image src={bidang.gambar_utama} alt={`Foto tim ${name}`} fill priority sizes="(max-width: 768px) 92vw, 1200px" className="object-cover object-center" />
            ) : (
              <div className="grid h-full place-items-center bg-gradient-to-br from-[#ff9d43] to-[#d75f00]">
                <Shield className="h-20 w-20 text-white/75 sm:h-28 sm:w-28" strokeWidth={1.2} aria-hidden="true" />
              </div>
            )}

            <Link href="https://www.instagram.com/bemundip" target="_blank" rel="noreferrer" className="bidang-instagram absolute z-10 rounded-full bg-[#ff7300] text-white transition hover:bg-[#df1e25]">
              Kunjungi Instagram
            </Link>
          </div>

          <div className="bidang-poster-buildings relative z-30 -mt-[2.2%] flex w-full overflow-hidden">
            <Image src="/assets/bidang-figma/buildings-left.svg" alt="" width={683} height={163} className="h-auto w-1/2 max-w-none -scale-x-100" />
            <Image src="/assets/bidang-figma/buildings-right.svg" alt="" width={683} height={163} className="h-auto w-1/2 max-w-none" />
          </div>
        </div>

        <BidangHeroPanel
          description={description}
          closingQuote={quotePenutup}
          leftContent={<>
            <p className="bidang-poster-headline whitespace-pre-line">{quoteHeadline}</p>
            {quoteSupporting ? <p className="bidang-poster-support whitespace-pre-line">{quoteSupporting}</p> : null}
            {programList[0]?.gambar_program ? (
              <div className="bidang-poster-program">
                <Image src={programList[0].gambar_program} alt={`Program ${programList[0].nama_program}`} fill sizes="(max-width: 640px) 18vw, 240px" className="object-contain" />
              </div>
            ) : null}
          </>}
        />
      </section>

      <BidangAnggotaReceipt
        bidang={bidang}
        anggotaList={anggotaList}
        anggotaError={anggotaError}
      />

      {programError || programList.length > 0 ? (
      <section className="bg-[#f5f5f5] px-5 pb-28 pt-16 text-brown sm:px-8 lg:pb-40 lg:pt-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex min-w-0 flex-col gap-3 border-b border-brown/20 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#df1e25]">Karya dan Gerak</p>
              <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Program Unggulan</h2>
            </div>
            <p className="min-w-0 max-w-md break-words text-sm leading-relaxed text-clay [overflow-wrap:anywhere]">Program yang dirancang dan dijalankan oleh {name}.</p>
          </div>

          {programError ? (
            <div className="mt-10 rounded-2xl border border-red/20 bg-white p-8 text-center">
              <AlertCircle className="mx-auto text-red" aria-hidden="true" />
              <p className="mt-3 font-semibold">Gagal memuat program unggulan.</p>
              <Button href={`/bidang/${numericId}`} variant="secondary" className="mt-5">Coba lagi</Button>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programList.map((program, index) => (
                <ProgramCard key={program.id_program} nama={program.nama_program} deskripsi={program.deskripsi_program} gambar={program.gambar_program} tanggalWaktu={program.tanggal_waktu_program} priority={index === 0} />
              ))}
            </div>
          )}
        </div>
      </section>
      ) : null}
    </main>
  );
}
