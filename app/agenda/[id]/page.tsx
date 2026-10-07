import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, UsersRound } from "lucide-react";
import { ActionLink } from "@/components/ActionLink";
import { BidangFigmaHeader } from "@/components/BidangFigmaHeader";
import { DetailBody, DetailHeader, DetailPill } from "@/components/DetailHeader";
import { Footer } from "@/components/Footer";
import { RelatedList } from "@/components/RelatedList";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { getAgendaById, getAgendaWithStatus } from "@/lib/agenda-public";
import { AGENDA_STATUS_META, getEffectiveStatus, todayInJakarta } from "@/lib/agenda-status";
import { agendaToFeedItem } from "@/lib/feed-items";
import { toExternalUrl } from "@/lib/url";

// The status is derived from today's date, so render on every request (the queries themselves are cached).
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

const RELATED_COUNT = 3;

function parseId(id: string): number | null {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseId(id);
  const agenda = numericId !== null ? await getAgendaById(numericId) : null;

  if (!agenda) {
    return { title: "Agenda tidak ditemukan — BEM UNDIP 2026" };
  }

  return {
    title: `${String(agenda.judul_agenda ?? "").trim() || "Tanpa judul"} — Agenda BEM UNDIP 2026`,
    description: String(agenda.deskripsi_program ?? "").slice(0, 160) || undefined
  };
}

export default async function AgendaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseId(id);
  if (numericId === null) notFound();

  const [agenda, allAgendas] = await Promise.all([getAgendaById(numericId), getAgendaWithStatus().catch(() => [])]);
  if (!agenda) notFound();

  const status = getEffectiveStatus(agenda.status_agenda, agenda.timeline_agenda, todayInJakarta());
  const statusMeta = AGENDA_STATUS_META[status];
  const title = String(agenda.judul_agenda ?? "").trim() || "Tanpa judul";
  const link = toExternalUrl(agenda.link_pendaftaran);
  const isOpen = status === "akan_datang" || status === "berlangsung";

  // Running and upcoming agendas come first in getAgendaWithStatus, so they lead the suggestions.
  const related = allAgendas
    .filter((item) => item.id_agenda !== agenda.id_agenda)
    .slice(0, RELATED_COUNT)
    .map(agendaToFeedItem);

  const details = [
    { icon: CalendarDays, label: "Waktu", value: agenda.timeline_agenda?.trim() },
    { icon: MapPin, label: "Lokasi", value: agenda.lokasi?.trim() },
    { icon: UsersRound, label: "Pelaksana", value: agenda.nama_bidang?.trim() }
  ].filter((detail): detail is typeof detail & { value: string } => Boolean(detail.value));

  return (
    <>
      <BidangFigmaHeader active="Agenda" className="bg-white" />
      <main id="main-content" className="landing-page overflow-hidden pb-20 sm:pb-24">
        <article className="landing-container">
          <DetailHeader
            backHref="/agenda"
            backLabel="Kembali ke Agenda"
            title={title}
            pills={
              <>
                <DetailPill className={statusMeta.className}>{statusMeta.label}</DetailPill>
                {agenda.nama_bidang ? <DetailPill>{agenda.nama_bidang.trim()}</DetailPill> : null}
              </>
            }
          />

          {details.length > 0 ? (
            <dl className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex min-w-0 items-start gap-3 rounded-2xl bg-surface px-4 py-3.5">
                  <Icon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-accent-deep" />
                  <div className="min-w-0">
                    <dt className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">{label}</dt>
                    <dd className="mt-1 break-words font-sans text-sm font-semibold text-charcoal [overflow-wrap:anywhere]">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          ) : null}

          {agenda.poster_agenda ? (
            <div className="mt-10">
              <ImageLightbox
                src={agenda.poster_agenda}
                alt={`Poster ${title}`}
                backdrop
                wrapperClassName="relative mx-auto aspect-[4/5] w-[min(100%,560px,64vh)] overflow-hidden rounded-[28px] bg-charcoal shadow-float"
                imageClassName="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                roundedClass="rounded-[28px]"
                priority
                quality={82}
              />
            </div>
          ) : null}

          <DetailBody heading="Tentang agenda" text={String(agenda.deskripsi_program ?? "").trim()} emptyText="Deskripsi agenda belum tersedia." />

          <div className="mx-auto mt-10 max-w-3xl border-t border-line pt-8 font-sans">
            {status === "dibatalkan" ? (
              <p className="text-sm font-semibold text-red">Agenda ini dibatalkan oleh panitia.</p>
            ) : link && isOpen ? (
              <ActionLink href={link} external>
                Daftar sekarang
              </ActionLink>
            ) : link ? (
              <ActionLink href={link} external variant="secondary">
                Lihat dokumentasi
              </ActionLink>
            ) : (
              <p className="text-sm font-medium text-ink/60">
                {isOpen ? "Informasi pendaftaran akan diumumkan menyusul." : "Agenda ini telah selesai."}
              </p>
            )}
          </div>
        </article>

        <RelatedList
          id="agenda-lainnya"
          eyebrow="Jangan lewatkan"
          title="Agenda lainnya"
          items={related}
          kind="agenda"
          moreHref="/agenda"
          moreLabel="Lihat semua agenda"
        />
      </main>
      <Footer />
    </>
  );
}
