/**
 * Validates that a string follows the required citation format: [Author, Year] or [Source, Year]
 */
export function validateCitationFormat(citation: string): boolean {
  const citationRegex = /^\[.+,\s\d{4}\]$/;
  return citationRegex.test(citation);
}

/**
 * Extracts citations from a text block
 */
export function extractCitations(text: string): string[] {
  const citationRegex = /\[.+?,\s\d{4}\]/g;
  return text.match(citationRegex) || [];
}
