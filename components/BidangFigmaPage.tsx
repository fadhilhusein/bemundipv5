import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Shield, UserRound, UsersRound } from "lucide-react";
import { ProgramCard } from "@/components/ProgramCard";
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
  const formattedMembers = new Intl.NumberFormat("id-ID").format(bidang.jumlah_anggota);
  const quoteUtama = bidang.quote_utama?.trim() || "Tanpa Rencana, Kamu Sampai di Sini.\nBukan seperti kafe. Tapi Warteg";
  const [quoteHeadline, ...quoteSupportingLines] = quoteUtama.split(/\r?\n/).filter(Boolean);
  const quoteSupporting = quoteSupportingLines.join("\n");
  const quotePenutup = bidang.quote_penutup?.trim() || "Cerita-Cerita Bermula di Sini. Beberapa Berakhir Dengan Baik.";

  return (
    <main className="overflow-hidden bg-[#f5f5f5] text-white">
      <section className="mx-auto w-full max-w-[1385px] px-4 pb-16 sm:px-7 lg:px-10">
        <Link href="/#bidang" className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#df1e25]/25 bg-white px-4 py-2 text-sm font-semibold text-[#df1e25] transition hover:-translate-x-0.5 hover:bg-[#df1e25] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#df1e25]">
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke Departemen
        </Link>

        <div className="bidang-hero-title grid min-w-0 items-end gap-2 pb-5 text-[#df1e25] md:grid-cols-[auto_1fr_auto] md:gap-5 lg:pb-8">
          <p className="font-sans text-[clamp(5rem,14vw,11rem)] font-black leading-[0.73] tracking-[-0.08em]">{acronym}</p>
          <h1 className="min-w-0 max-w-[650px] break-words pb-1 font-sans text-[clamp(1.4rem,4.2vw,4rem)] font-bold uppercase leading-[0.88] tracking-[-0.055em] [overflow-wrap:anywhere] md:pb-0">{name}</h1>
          <p className="font-sans text-[clamp(4.5rem,12vw,10rem)] font-medium leading-[0.72] tracking-[-0.08em]">2026</p>
        </div>

        <div className="relative pt-[8%]">
          <Image src="/assets/bidang-figma/roof.svg" alt="" width={1529} height={154} priority className="pointer-events-none absolute inset-x-0 top-0 z-20 h-auto w-full" />

          <div className="bidang-photo-mask relative mx-[4.5%] aspect-[2.86/1] overflow-hidden border-x border-black/60 bg-[#fd853a]">
            {bidang.gambar_utama ? (
              <Image src={bidang.gambar_utama} alt={`Foto tim ${name}`} fill priority sizes="(max-width: 768px) 92vw, 1200px" className="object-cover object-center" />
            ) : (
              <div className="grid h-full place-items-center bg-gradient-to-br from-[#ff9d43] to-[#d75f00]">
                <Shield className="h-20 w-20 text-white/75 sm:h-28 sm:w-28" strokeWidth={1.2} aria-hidden="true" />
              </div>
            )}

            <Link href="https://www.instagram.com/bemundip" target="_blank" rel="noreferrer" className="absolute left-5 top-8 z-10 rounded-full bg-[#ff8d28] px-5 py-2 text-[10px] font-semibold uppercase tracking-wide text-white shadow sm:left-9 sm:top-12 sm:px-8 sm:text-sm">
              Kunjungi Instagram
            </Link>
          </div>

          <div className="relative z-30 -mt-[2.2%] flex w-full overflow-hidden">
            <Image src="/assets/bidang-figma/buildings-left.svg" alt="" width={683} height={163} className="h-auto w-1/2 max-w-none" />
            <Image src="/assets/bidang-figma/buildings-right.svg" alt="" width={683} height={163} className="h-auto w-1/2 max-w-none" />
          </div>
        </div>

        <div className="mx-[4.5%] bg-[#ff7100] px-6 pb-10 pt-8 sm:px-10 sm:pb-14 lg:px-14 lg:pb-16 lg:pt-12">
          <div className="grid min-w-0 gap-9 md:grid-cols-[1fr_0.95fr] md:gap-14">
            <div className="min-w-0">
              <p className="max-w-[520px] whitespace-pre-line font-sans text-[clamp(2.25rem,5vw,5rem)] font-light uppercase leading-[0.86] tracking-[-0.055em]">{quoteHeadline}</p>
              {quoteSupporting ? <p className="mt-7 whitespace-pre-line font-script text-3xl leading-tight sm:text-5xl">{quoteSupporting}</p> : null}
            </div>

            <div className="min-w-0 self-center">
              <p className="font-display text-lg">Profil Bidang</p>
              <p className="bidang-description mt-2 whitespace-pre-line text-sm leading-relaxed text-white/95 sm:text-base">{description}</p>
            </div>
          </div>

          <div className="mt-10 grid min-w-0 gap-9 border-t border-white/25 pt-9 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="min-w-0 space-y-3 text-sm sm:text-base">
              <p className="flex items-center gap-3">
                <UserRound size={20} aria-hidden="true" />
                <span><span className="text-white/75">Ketua / PIC</span><br /><strong>{bidang.penanggung_jawab.trim() || "—"}</strong></span>
              </p>
              <p className="flex items-center gap-3">
                <UsersRound size={20} aria-hidden="true" />
                <span><span className="text-white/75">Total Anggota</span><br /><strong>{formattedMembers} orang</strong></span>
              </p>
            </div>

            {programList[0]?.gambar_program ? (
              <div className="relative mx-auto aspect-[1.25/1] w-44 -rotate-6 overflow-hidden rounded bg-white p-2 shadow-xl sm:w-56">
                <Image src={programList[0].gambar_program} alt={`Program ${programList[0].nama_program}`} fill sizes="224px" className="object-cover p-2" />
              </div>
            ) : (
              <div className="hidden h-1 w-10 md:block" aria-hidden="true" />
            )}

            <p className="min-w-0 max-w-full whitespace-pre-line break-words text-left font-sans text-[clamp(1.55rem,4.5vw,4.25rem)] font-light uppercase leading-[0.86] tracking-[-0.05em] [overflow-wrap:anywhere] md:text-right">{quotePenutup}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f5f5] px-5 pb-12 pt-10 text-brown sm:px-8 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex min-w-0 flex-col gap-3 border-b border-brown/20 pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#df1e25]">Orang-Orang di Baliknya</p>
              <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Anggota Bidang</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-clay">Kenali tim yang menggerakkan {name}.</p>
          </div>

          {anggotaError ? (
            <div className="mt-10 rounded-2xl border border-red/20 bg-white p-8 text-center">
              <AlertCircle className="mx-auto text-red" aria-hidden="true" />
              <p className="mt-3 font-semibold">Gagal memuat daftar anggota.</p>
            </div>
          ) : anggotaList.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-clay/35 bg-white/50 px-6 py-12 text-center text-clay">Daftar anggota bidang belum ditambahkan.</p>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
              {anggotaList.map((anggota, index) => (
                <article key={anggota.id} className={`min-w-0 ${index % 2 === 1 ? "sm:translate-y-8" : ""}`}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] border-2 border-[#ff7100] bg-[#ff8d28] shadow-card">
                    {anggota.foto ? (
                      <Image src={anggota.foto} alt={`Foto ${anggota.nama_anggota}`} fill sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 270px" className="object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-white/75"><UserRound className="h-20 w-20" strokeWidth={1.2} aria-hidden="true" /></div>
                    )}
                    <span className="absolute bottom-3 left-3 rounded-full bg-[#ff7100] px-3 py-1 text-xs font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-4 break-words font-display text-xl font-bold leading-tight text-brown [overflow-wrap:anywhere]">{anggota.nama_anggota}</h3>
                  <p className="mt-1 break-words text-sm font-medium uppercase tracking-wide text-[#df1e25] [overflow-wrap:anywhere]">{anggota.jabatan || "Anggota"}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

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
          ) : programList.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-clay/35 bg-white/50 px-6 py-12 text-center text-clay">Belum ada program unggulan yang ditambahkan untuk bidang ini.</p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programList.map((program, index) => (
                <ProgramCard key={program.id_program} nama={program.nama_program} deskripsi={program.deskripsi_program} gambar={program.gambar_program} tanggalWaktu={program.tanggal_waktu_program} priority={index === 0} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
