/**
 * Strips HTML tags from a string.
 * @param html The HTML string to clean.
 * @returns The cleaned string.
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};
