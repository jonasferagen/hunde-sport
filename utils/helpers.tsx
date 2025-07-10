import { decode } from 'he';
import tinycolor from 'tinycolor2';

export const stripHtml = (html: string) =>
    html.replace(/<[^>]*>/g, '');

export const decodeHtmlEntities = (html: string) =>
    decode(html);

export const formatPrice = (price: string): string =>
    Number(price).toFixed(0).replace('.', ',') + ',-';

export const lighten = (color: string, amount: number) =>
    tinycolor(color).lighten(amount).toString();

export const darken = (color: string, amount: number) =>
    tinycolor(color).darken(amount).toString();

export const rgba = (color: string, alpha: number): string =>
    tinycolor(color).setAlpha(alpha).toString();

