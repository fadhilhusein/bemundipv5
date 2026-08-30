import "server-only";

import { unstable_cache } from "next/cache";
import client from "@/lib/db";

export type AgendaRecord = {
  id_agenda: number;
  id_bidang: number | null;
  nama_bidang?: string | null;
  judul_agenda: string;
  deskripsi_program: string | null;
  timeline_agenda: string | null;
  lokasi: string | null;
  poster_agenda: string | null;
  link_pendaftaran: string | null;
  status_agenda: string;
};

export const getAgendaList = unstable_cache(
  async (): Promise<AgendaRecord[]> => {
    return client`
      SELECT a.id_agenda, a.id_bidang, b.nama_bidang, a.judul_agenda, a.deskripsi_program, a.timeline_agenda, a.lokasi, a.poster_agenda, a.link_pendaftaran, a.status_agenda
      FROM agenda a
      LEFT JOIN bidang b ON a.id_bidang = b.id
      ORDER BY a.id_agenda DESC
    ` as unknown as AgendaRecord[];
  },
  ["agenda-list"],
  { tags: ["agenda"], revalidate: 60 }
);

export const getAgendaCount = unstable_cache(
  async (): Promise<number> => {
    const rows = (await client`SELECT COUNT(*)::int AS count FROM agenda`) as unknown as { count: number }[];
    return rows[0]?.count ?? 0;
  },
  ["agenda-count"],
  { tags: ["agenda"], revalidate: 60 }
);

export const getAgendaPaginated = (page: number, limit: number) =>
  unstable_cache(
    async (): Promise<AgendaRecord[]> => {
      const offset = (page - 1) * limit;
      return client`
        SELECT a.id_agenda, a.id_bidang, b.nama_bidang, a.judul_agenda, a.deskripsi_program, a.timeline_agenda, a.lokasi, a.poster_agenda, a.link_pendaftaran, a.status_agenda
        FROM agenda a
        LEFT JOIN bidang b ON a.id_bidang = b.id
        ORDER BY a.id_agenda DESC
        LIMIT ${limit} OFFSET ${offset}
      ` as unknown as AgendaRecord[];
    },
    [`agenda-paginated-${page}-${limit}`],
    { tags: ["agenda"], revalidate: 60 }
  )();
