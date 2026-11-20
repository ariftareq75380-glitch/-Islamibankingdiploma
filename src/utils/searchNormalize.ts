/**
 * Shared search normalization.
 *
 * Bengali digits (০-৯) and Latin digits (0-9) mean the same thing to a
 * reader, but plain string matching treats them as different characters —
 * so searching "১০৪" never matched a title containing "104" and vice
 * versa. Normalizing both the query and the searched text to Latin digits
 * (and lowercase) makes code numbers such as 103/104/105/106 findable in
 * either digit system, while ordinary word search is unchanged.
 */

const BENGALI_DIGITS = '০১২৩৪৫৬৭৮৯';

/** Lowercase the text and convert any Bengali digits to Latin digits. */
export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[০-৯]/g, (digit) => String(BENGALI_DIGITS.indexOf(digit)));
}

/**
 * Normalized substring match. `normalizedQuery` must already be passed
 * through normalizeSearchText. An empty query never matches.
 */
export function searchTextMatches(
  haystack: string | undefined | null,
  normalizedQuery: string,
): boolean {
  if (!haystack || !normalizedQuery) return false;
  return normalizeSearchText(haystack).includes(normalizedQuery);
}
