import type { Image } from "../types";

/**
 * Strips HTML tags from a string.
 * @param html The HTML string to clean.
 * @returns The cleaned string.
 */
export const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

export const thumbnail = (image: Image): string => {
  const cleaned = image.src.substring(0, image.src.lastIndexOf('?'));
  const extension = cleaned.substring(cleaned.lastIndexOf('.'));
  const thumbnail = cleaned.substring(0, cleaned.lastIndexOf(extension));
  return thumbnail + '-50x50' + extension;
}
