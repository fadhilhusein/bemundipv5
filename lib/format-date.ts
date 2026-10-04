function toDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  const date = value instanceof Date ? value : new Date(value as string | number);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatTanggal(value: unknown, month: "long" | "short" = "long"): string {
  const date = toDate(value);
  if (!date) return value == null ? "" : String(value);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month,
    year: "numeric",
    timeZone: "Asia/Jakarta"
  }).format(date);
}

export function toIsoDate(value: unknown): string {
  const date = toDate(value);
  return date ? date.toISOString() : "";
}
