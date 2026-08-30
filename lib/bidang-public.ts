import "server-only";

import { unstable_cache } from "next/cache";
import client from "@/lib/db";

export type BidangRecord = {
  id: number;
  nama_bidang: string;
  deskripsi: string;
  penanggung_jawab: string;
  jumlah_anggota: number;
  gambar: string | null;
  created_at: string;
};

export type ProgramUnggulanRecord = {
  id_program: number;
  id_bidang: number;
  nama_program: string;
  deskripsi_program: string | null;
  gambar_program: string | null;
  tanggal_waktu_program: string | null;
};

export const getBidangList = unstable_cache(
  async (): Promise<BidangRecord[]> => {
    return client`
      SELECT id, nama_bidang, deskripsi, penanggung_jawab, jumlah_anggota, gambar, created_at
      FROM bidang
      ORDER BY nama_bidang ASC
    ` as unknown as BidangRecord[];
  },
  ["bidang-list"],
  { tags: ["bidang"], revalidate: 60 }
);

export const getBidangById = (id: number) =>
  unstable_cache(
    async (): Promise<BidangRecord | null> => {
      const rows = (await client`
        SELECT id, nama_bidang, deskripsi, penanggung_jawab, jumlah_anggota, gambar, created_at
        FROM bidang
        WHERE id = ${id}
        LIMIT 1
      `) as unknown as BidangRecord[];
      return rows[0] ?? null;
    },
    [`bidang-detail-${id}`],
    { tags: ["bidang"], revalidate: 60 }
  )();

export const getProgramUnggulanByBidang = (bidangId: number) =>
  unstable_cache(
    async (): Promise<ProgramUnggulanRecord[]> => {
      return (await client`
        SELECT id_program, id_bidang, nama_program, deskripsi_program, gambar_program, tanggal_waktu_program
        FROM program_unggulan
        WHERE id_bidang = ${bidangId}
        ORDER BY id_program ASC
      `) as unknown as ProgramUnggulanRecord[];
    },
    [`bidang-program-unggulan-${bidangId}`],
    { tags: ["bidang"], revalidate: 60 }
  )();
