const MAX_SEARCH_LENGTH = 100;

/** Reads `?q=` from search params: first value only, collapsed whitespace, capped length. */
export function normalizeSearchQuery(raw: unknown): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, MAX_SEARCH_LENGTH);
}

function fold(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/**
 * True when every word of the query appears somewhere in the given fields,
 * ignoring case and accents. Used for lists that are filtered in memory (agenda, layanan).
 */
export function matchesSearch(query: string, fields: Array<string | null | undefined>): boolean {
  const words = fold(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const haystack = fold(fields.filter(Boolean).join(" "));
  return words.every((word) => haystack.includes(word));
}

/** Keeps only matching items and puts title matches first, like the news search. Order is otherwise preserved. */
export function searchItems<T>(items: T[], query: string, title: (item: T) => string | null | undefined, fields: (item: T) => Array<string | null | undefined>): T[] {
  if (!query) return items;
  return items
    .filter((item) => matchesSearch(query, [title(item), ...fields(item)]))
    .sort((a, b) => Number(matchesSearch(query, [title(b)])) - Number(matchesSearch(query, [title(a)])));
}
