import "server-only";

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

export async function getBidangList(): Promise<BidangRecord[]> {
  return client`
    SELECT id, nama_bidang, deskripsi, penanggung_jawab, jumlah_anggota, gambar, created_at
    FROM bidang
    ORDER BY nama_bidang ASC
  ` as unknown as BidangRecord[];
}

export async function getBidangById(id: number): Promise<BidangRecord | null> {
  const rows = (await client`
    SELECT id, nama_bidang, deskripsi, penanggung_jawab, jumlah_anggota, gambar, created_at
    FROM bidang
    WHERE id = ${id}
    LIMIT 1
  `) as unknown as BidangRecord[];
  return rows[0] ?? null;
}
