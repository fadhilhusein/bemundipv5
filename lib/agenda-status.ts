// Agenda status helpers. The database only has a manual `status_agenda` enum and a free-text
// `timeline_agenda`, so the effective status is derived here by reading dates out of that text.

export type AgendaStatus = "akan_datang" | "berlangsung" | "selesai" | "dibatalkan";

/** Calendar date as "YYYY-MM-DD"; compares correctly as a plain string. */
type DateKey = string;

const MONTHS: Record<string, number> = {
  januari: 1, jan: 1,
  februari: 2, feb: 2, peb: 2,
  maret: 3, mar: 3,
  april: 4, apr: 4,
  mei: 5,
  juni: 6, jun: 6,
  juli: 7, jul: 7,
  agustus: 8, agu: 8, agt: 8, ags: 8, aug: 8,
  september: 9, sep: 9, sept: 9,
  oktober: 10, okt: 10, oct: 10,
  november: 11, nov: 11, nop: 11,
  desember: 12, des: 12, dec: 12
};

function toKey(year: number, month: number, day: number): DateKey | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Reads the earliest and latest calendar dates written in a timeline such as
 * "12-15 Agustus 2026", "30 Juli – 2 Agustus 2026", "Sabtu, 12 Sep 2026" or "12/08/2026".
 * Returns null when no date with a known year is found.
 */
export function parseTimelineRange(text: string | null | undefined): { start: DateKey; end: DateKey } | null {
  if (!text) return null;
  const source = text.toLowerCase();
  const years = [...source.matchAll(/\b(20\d{2})\b/g)].map((match) => ({ index: match.index ?? 0, year: Number(match[1]) }));
  const yearFor = (index: number) => years.find((entry) => entry.index > index)?.year ?? years.at(-1)?.year;
  const dates: DateKey[] = [];
  const push = (key: DateKey | null) => {
    if (key) dates.push(key);
  };

  for (const match of source.matchAll(/\b(\d{4})-(\d{1,2})-(\d{1,2})\b/g)) {
    push(toKey(Number(match[1]), Number(match[2]), Number(match[3])));
  }
  for (const match of source.matchAll(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\b/g)) {
    push(toKey(Number(match[3]), Number(match[2]), Number(match[1])));
  }
  // Day range sharing one month: "12-15 Agustus 2026".
  for (const match of source.matchAll(/\b(\d{1,2})\s*[-–—]\s*(\d{1,2})\s*([a-z]+)\.?/g)) {
    const month = MONTHS[match[3]];
    const year = yearFor(match.index ?? 0);
    if (month && year) {
      push(toKey(year, month, Number(match[1])));
      push(toKey(year, month, Number(match[2])));
    }
  }
  // Single day with a month name: "2 Agustus", "12 Sep 2026".
  for (const match of source.matchAll(/\b(\d{1,2})\s*([a-z]+)\.?/g)) {
    const month = MONTHS[match[2]];
    const year = yearFor(match.index ?? 0);
    if (month && year) push(toKey(year, month, Number(match[1])));
  }

  if (dates.length === 0) return null;
  dates.sort();
  return { start: dates[0], end: dates[dates.length - 1] };
}

export function todayInJakarta(now = new Date()): DateKey {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}

/**
 * Manual "dibatalkan"/"selesai" always wins. Otherwise dates found in the timeline decide;
 * without readable dates the manual status is used as-is.
 */
export function getEffectiveStatus(status: string, timeline: string | null | undefined, today: DateKey): AgendaStatus {
  if (status === "dibatalkan" || status === "selesai") return status;
  const range = parseTimelineRange(timeline);
  if (range) {
    if (today > range.end) return "selesai";
    if (today >= range.start) return "berlangsung";
    return "akan_datang";
  }
  return status === "berlangsung" ? "berlangsung" : "akan_datang";
}

export const AGENDA_STATUS_META: Record<AgendaStatus, { label: string; className: string }> = {
  akan_datang: { label: "Akan datang", className: "bg-[#FFF3A8] text-charcoal" },
  berlangsung: { label: "Sedang berlangsung", className: "bg-accent-deep text-white" },
  selesai: { label: "Selesai", className: "bg-line text-ink" },
  dibatalkan: { label: "Dibatalkan", className: "bg-[#FDE2E1] text-red" }
};

/** Running and upcoming agendas first, then finished, then cancelled. */
export const AGENDA_STATUS_ORDER: Record<AgendaStatus, number> = {
  berlangsung: 0,
  akan_datang: 1,
  selesai: 2,
  dibatalkan: 3
};
