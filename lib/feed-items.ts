import type { FeedItem } from "@/components/EditorialFeed";
import type { AgendaWithStatus } from "@/lib/agenda-public";
import { AGENDA_STATUS_META } from "@/lib/agenda-status";
import { formatTanggal, toIsoDate } from "@/lib/format-date";
import type { LayananRecord } from "@/lib/layanan-public";
import type { PublikasiRecord } from "@/lib/publikasi-public";
import { hostOf, toExternalUrl } from "@/lib/url";

// Database rows → card data, shared by the listing pages and the "lainnya" section on detail pages.

const excerptOf = (text: string | null | undefined) => String(text ?? "").replace(/\s+/g, " ").trim();

export function publikasiToFeedItem(item: PublikasiRecord): FeedItem {
  return {
    id: item.id_publikasi,
    href: `/publikasi/${item.id_publikasi}`,
    title: String(item.judul_publikasi ?? "").trim() || "Tanpa judul",
    excerpt: excerptOf(item.isi_publikasi),
    image: item.gambar_publikasi,
    tag: item.kategori_publikasi?.trim() || "Publikasi",
    meta: formatTanggal(item.tanggal_publikasi),
    metaDateTime: toIsoDate(item.tanggal_publikasi)
  };
}

export function agendaToFeedItem(agenda: AgendaWithStatus): FeedItem {
  return {
    id: agenda.id_agenda,
    href: `/agenda/${agenda.id_agenda}`,
    title: String(agenda.judul_agenda ?? "").trim() || "Tanpa judul",
    excerpt: excerptOf(agenda.deskripsi_program),
    image: agenda.poster_agenda?.trim() || null,
    tag: agenda.nama_bidang?.trim() || "BEM UNDIP",
    meta: agenda.timeline_agenda?.trim() || undefined,
    status: AGENDA_STATUS_META[agenda.status],
    location: agenda.lokasi?.trim() || null,
    muted: agenda.status === "selesai" || agenda.status === "dibatalkan"
  };
}

export function layananToFeedItem(layanan: LayananRecord): FeedItem {
  return {
    id: layanan.id_layanan,
    href: `/layanan/${layanan.id_layanan}`,
    title: String(layanan.nama_layanan ?? "").trim() || "Layanan tanpa nama",
    excerpt: excerptOf(layanan.deskripsi_layanan),
    image: layanan.icon_layanan?.trim() || null,
    tag: "Layanan",
    meta: hostOf(toExternalUrl(layanan.link_layanan)) ?? undefined
  };
}
