import "server-only";

import { unstable_cache } from "next/cache";
import client from "@/lib/db";

export type LayananRecord = {
  id_layanan: number;
  id_kabinet: number;
  nama_layanan: string;
  deskripsi_layanan: string | null;
  icon_layanan: string | null;
  link_layanan: string | null;
  urutan_tampil: number;
};

export const getLayananList = unstable_cache(
  async (): Promise<LayananRecord[]> => {
    return client`
      SELECT id_layanan, id_kabinet, nama_layanan, deskripsi_layanan, icon_layanan, link_layanan, urutan_tampil
      FROM layanan
      ORDER BY urutan_tampil ASC, id_layanan ASC
    ` as unknown as LayananRecord[];
  },
  ["layanan-list"],
  { tags: ["layanan"], revalidate: 60 }
);

export const getLayananById = (id: number) =>
  unstable_cache(
    async (): Promise<LayananRecord | null> => {
      const rows = (await client`
        SELECT id_layanan, id_kabinet, nama_layanan, deskripsi_layanan, icon_layanan, link_layanan, urutan_tampil
        FROM layanan
        WHERE id_layanan = ${id}
        LIMIT 1
      `) as unknown as LayananRecord[];
      return rows[0] ?? null;
    },
    [`layanan-detail-${id}`],
    { tags: ["layanan"], revalidate: 60 }
  )();
