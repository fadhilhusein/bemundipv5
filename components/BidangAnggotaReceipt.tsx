"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Camera, X } from "lucide-react";
import type { AnggotaBidangRecord, BidangRecord } from "@/lib/bidang-public";

type Props = {
  bidang: BidangRecord;
  anggotaList: AnggotaBidangRecord[];
  anggotaError: string | null;
};

function getLeadershipTitle(bidangName: string) {
  const normalized = bidangName.trim().toLowerCase();
  if (normalized.startsWith("kantor")) {
    return { lead: "KAKANTOR", deputy: "WAKANTOR" };
  }
  if (normalized.startsWith("biro")) {
    return { lead: "KABIRO", deputy: "WAKABIRO" };
  }
  if (normalized.startsWith("unit")) {
    return { lead: "KEPALA UNIT", deputy: "WAKIL KEPALA UNIT" };
  }
  return { lead: "KABIDANG", deputy: "WAKABIDANG" };
}

export function BidangAnggotaReceipt({ bidang, anggotaList, anggotaError }: Props) {
  const [selectedAnggota, setSelectedAnggota] = useState<AnggotaBidangRecord | null>(null);

  const name = bidang.nama_bidang.trim() || "Bidang BEM UNDIP";
  const titles = getLeadershipTitle(name);

  // Find deputy if present in member roster
  const deputyMember = anggotaList.find((item) =>
    /wakil|waka|deputy/i.test(item.jabatan ?? "")
  );

  const totalPesanan = Math.max(bidang.jumlah_anggota || 0, anggotaList.length);

  // Determine how many blank placeholder rows to show (like the Figma design)
  // In Figma, when there are fewer entries than total capacity, blank lined rows are shown
  const placeholderCount = Math.max(0, Math.min(totalPesanan - anggotaList.length, 12));

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedAnggota) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedAnggota(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAnggota]);

  return (
    <section className="mx-auto w-full max-w-[1385px] overflow-hidden bg-[#f5f5f5] px-3 text-black sm:px-7 lg:px-10" aria-label="Daftar Anggota">
      <div className="bidang-anggota-frame w-full">
        {/* Receipt / Nota Card */}
        <article className="bidang-receipt relative w-full overflow-hidden border border-black/20 p-4 shadow-[0_18px_45px_rgba(64,35,18,0.16)] sm:p-8 lg:p-12">
          {/* Receipt Header */}
          <header className="text-center">
            <h2 className="font-landing-display text-2xl font-black uppercase tracking-wider text-black sm:text-3xl lg:text-4xl">
              Anggota Kami
            </h2>
            <p className="mt-3 font-sans text-[11px] uppercase text-black/85 sm:text-sm">
              {name}
            </p>
          </header>

          {/* Leadership lines */}
          <div className="space-y-1 font-sans text-xs uppercase text-black sm:text-sm">
            <p className="flex flex-wrap items-baseline gap-1.5">
              <span className="shrink-0">NAMA {titles.lead}:</span>
              <span className="break-words">
                {bidang.penanggung_jawab?.trim() || "—"}
              </span>
            </p>
            <p className="flex flex-wrap items-baseline gap-1.5">
              <span className="shrink-0">NAMA {titles.deputy}:</span>
              <span className="break-words">
                {deputyMember?.nama_anggota || "—"}
              </span>
            </p>
          </div>

          <div className="mb-2 mt-5 border-b border-black/30" />

          {/* Table Header */}
          <div className="grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,6.5rem)] items-center gap-2 pb-2 font-sans text-[11px] font-bold uppercase tracking-tight text-black sm:grid-cols-[3.25rem_minmax(0,1fr)_9.5rem] sm:text-sm sm:tracking-wider">
            <span>NO</span>
            <span>NAMA</span>
            <span className="text-right sm:text-left">KETERANGAN</span>
          </div>

          {/* Table Content */}
          {anggotaError ? (
            <div className="py-8 text-center font-sans text-sm text-black/80">
              <p className="font-semibold">Gagal memuat data anggota.</p>
              <p className="mt-1 text-xs text-black/60">Silakan coba lagi beberapa saat kemudian.</p>
            </div>
          ) : anggotaList.length === 0 ? (
            <div className="space-y-0 py-2">
              <p className="py-4 text-center font-sans text-[11px] font-semibold uppercase tracking-wider text-black/60 sm:text-sm">
                Daftar anggota belum diisi oleh pengurus bidang
              </p>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,6.5rem)] items-center gap-2 py-2 font-mono text-[11px] text-black/40 border-b border-black/25 sm:grid-cols-[3.25rem_minmax(0,1fr)_9.5rem] sm:text-sm"
                >
                  <span>{i + 1}</span>
                  <span className="border-b border-dashed border-black/25 w-4/5">&nbsp;</span>
                  <span className="text-right sm:text-left">—</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-mono text-[11px] text-black sm:text-sm">
              {anggotaList.map((anggota, index) => {
                const hasPhoto = Boolean(anggota.foto);
                return (
                  <div
                    key={anggota.id}
                    className="grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,6.5rem)] items-center gap-2 border-b border-dashed border-black/30 py-2 transition-colors last:border-b-0 hover:bg-black/5 sm:grid-cols-[3.25rem_minmax(0,1fr)_9.5rem]"
                  >
                    <span className="font-bold">{index + 1}</span>

                    <div className="min-w-0 pr-1">
                      {hasPhoto ? (
                        <button
                          type="button"
                          onClick={() => setSelectedAnggota(anggota)}
                          className="group inline-flex items-center gap-1 text-left font-medium uppercase tracking-tight text-black hover:text-[#d96a1c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
                          title="Klik untuk melihat foto"
                        >
                          <span className="truncate">{anggota.nama_anggota}</span>
                          <Camera
                            size={12}
                            className="shrink-0 text-black/50 transition-colors group-hover:text-[#d96a1c]"
                            aria-hidden="true"
                          />
                        </button>
                      ) : (
                        <span className="truncate block font-medium uppercase tracking-tight">
                          {anggota.nama_anggota}
                        </span>
                      )}
                    </div>

                    <span className="min-w-0 text-right sm:text-left font-bold uppercase tracking-tight text-black/90 truncate">
                      {anggota.jabatan || "STAFF"}
                    </span>
                  </div>
                );
              })}

              {/* Blank placeholder rows to match total capacity, exactly like Figma receipt */}
              {Array.from({ length: placeholderCount }).map((_, i) => {
                const rowNumber = anggotaList.length + i + 1;
                return (
                  <div
                    key={`extra-${rowNumber}`}
                    className="grid grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,6.5rem)] items-center gap-2 py-2 font-mono text-[11px] text-black/45 sm:grid-cols-[3.25rem_minmax(0,1fr)_9.5rem] sm:text-sm"
                  >
                    <span>{rowNumber}</span>
                    <span className="border-b border-black/30 w-3/4">&nbsp;</span>
                    <span className="text-right sm:text-left">—</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Receipt Footer */}
          <div className="mt-4 flex items-baseline justify-between gap-4 font-sans text-xs uppercase text-black sm:text-sm">
            <p>
              TOTAL ANGGOTA
            </p>
            <span className="font-mono text-base sm:text-lg">{totalPesanan}</span>
          </div>

        </article>
      </div>

      {/* Member Photo Modal / Lightbox */}
      {selectedAnggota && selectedAnggota.foto ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${selectedAnggota.nama_anggota}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setSelectedAnggota(null)}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedAnggota(null)}
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
              aria-label="Tutup pratinjau"
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-xl border-2 border-black/10 bg-[#ff8d28]">
              <Image
                src={selectedAnggota.foto}
                alt={`Foto ${selectedAnggota.nama_anggota}`}
                fill
                sizes="384px"
                className="object-cover"
              />
            </div>

            <div className="mt-4 text-center">
              <h3 className="font-display text-xl font-bold uppercase text-black">
                {selectedAnggota.nama_anggota}
              </h3>
              <p className="mt-1 font-sans text-xs font-semibold uppercase tracking-wider text-[#d96a1c]">
                {selectedAnggota.jabatan || "STAFF"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
