import "server-only";

import { unstable_cache } from "next/cache";
import client from "@/lib/db";
import { AGENDA_STATUS_ORDER, getEffectiveStatus, todayInJakarta, type AgendaStatus } from "@/lib/agenda-status";

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

export const getAgendaById = (id: number) =>
  unstable_cache(
    async (): Promise<AgendaRecord | null> => {
      const rows = (await client`
        SELECT a.id_agenda, a.id_bidang, b.nama_bidang, a.judul_agenda, a.deskripsi_program, a.timeline_agenda, a.lokasi, a.poster_agenda, a.link_pendaftaran, a.status_agenda
        FROM agenda a
        LEFT JOIN bidang b ON a.id_bidang = b.id
        WHERE a.id_agenda = ${id}
        LIMIT 1
      `) as unknown as AgendaRecord[];
      return rows[0] ?? null;
    },
    [`agenda-detail-${id}`],
    { tags: ["agenda"], revalidate: 60 }
  )();

export type AgendaWithStatus = AgendaRecord & { status: AgendaStatus };

/** All agendas with their status for today, running and upcoming first. Computed per request; the query is cached. */
export async function getAgendaWithStatus(): Promise<AgendaWithStatus[]> {
  const today = todayInJakarta();
  return (await getAgendaList())
    .map((agenda) => ({ ...agenda, status: getEffectiveStatus(agenda.status_agenda, agenda.timeline_agenda, today) }))
    .sort((a, b) => AGENDA_STATUS_ORDER[a.status] - AGENDA_STATUS_ORDER[b.status] || b.id_agenda - a.id_agenda);
}
