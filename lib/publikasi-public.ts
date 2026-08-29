import "server-only";

import client from "@/lib/db";

export type PublikasiRecord = {
  id_publikasi: number;
  id_penulis: number;
  judul_publikasi: string;
  isi_publikasi: string;
  gambar_publikasi: string | null;
  tanggal_publikasi: string;
  kategori_publikasi: string | null;
};

export async function getPublikasiList(): Promise<PublikasiRecord[]> {
  return client`
    SELECT id_publikasi, id_penulis, judul_publikasi, isi_publikasi, gambar_publikasi, tanggal_publikasi, kategori_publikasi
    FROM publikasi_terkini
    ORDER BY tanggal_publikasi DESC
  ` as unknown as PublikasiRecord[];
}

export async function getPublikasiCount(): Promise<number> {
  const rows = (await client`SELECT COUNT(*)::int AS count FROM publikasi_terkini`) as unknown as { count: number }[];
  return rows[0]?.count ?? 0;
}

export async function getPublikasiPaginated(page: number, limit: number): Promise<PublikasiRecord[]> {
  const offset = (page - 1) * limit;
  return client`
    SELECT id_publikasi, id_penulis, judul_publikasi, isi_publikasi, gambar_publikasi, tanggal_publikasi, kategori_publikasi
    FROM publikasi_terkini
    ORDER BY tanggal_publikasi DESC
    LIMIT ${limit} OFFSET ${offset}
  ` as unknown as PublikasiRecord[];
}

export async function getPublikasiById(id: number): Promise<PublikasiRecord | null> {
  const rows = (await client`
    SELECT id_publikasi, id_penulis, judul_publikasi, isi_publikasi, gambar_publikasi, tanggal_publikasi, kategori_publikasi
    FROM publikasi_terkini
    WHERE id_publikasi = ${id}
    LIMIT 1
  `) as unknown as PublikasiRecord[];
  return rows[0] ?? null;
}