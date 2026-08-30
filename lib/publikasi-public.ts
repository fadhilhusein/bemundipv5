import "server-only";

import { unstable_cache } from "next/cache";
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

export const getPublikasiList = unstable_cache(
  async (): Promise<PublikasiRecord[]> => {
    return client`
      SELECT id_publikasi, id_penulis, judul_publikasi, isi_publikasi, gambar_publikasi, tanggal_publikasi, kategori_publikasi
      FROM publikasi_terkini
      ORDER BY tanggal_publikasi DESC
    ` as unknown as PublikasiRecord[];
  },
  ["publikasi-list"],
  { tags: ["publikasi"], revalidate: 60 }
);

export const getPublikasiCount = unstable_cache(
  async (): Promise<number> => {
    const rows = (await client`SELECT COUNT(*)::int AS count FROM publikasi_terkini`) as unknown as { count: number }[];
    return rows[0]?.count ?? 0;
  },
  ["publikasi-count"],
  { tags: ["publikasi"], revalidate: 60 }
);

export const getPublikasiPaginated = (page: number, limit: number) =>
  unstable_cache(
    async (): Promise<PublikasiRecord[]> => {
      const offset = (page - 1) * limit;
      return client`
        SELECT id_publikasi, id_penulis, judul_publikasi, isi_publikasi, gambar_publikasi, tanggal_publikasi, kategori_publikasi
        FROM publikasi_terkini
        ORDER BY tanggal_publikasi DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as unknown as PublikasiRecord[];
    },
    [`publikasi-paginated-${page}-${limit}`],
    { tags: ["publikasi"], revalidate: 60 }
  )();

export const getPublikasiById = (id: number) =>
  unstable_cache(
    async (): Promise<PublikasiRecord | null> => {
      const rows = (await client`
        SELECT id_publikasi, id_penulis, judul_publikasi, isi_publikasi, gambar_publikasi, tanggal_publikasi, kategori_publikasi
        FROM publikasi_terkini
        WHERE id_publikasi = ${id}
        LIMIT 1
      `) as unknown as PublikasiRecord[];
      return rows[0] ?? null;
    },
    [`publikasi-detail-${id}`],
    { tags: ["publikasi"], revalidate: 60 }
  )();