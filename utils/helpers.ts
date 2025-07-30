import { decode } from 'he';

import { ProductPriceRange } from '@/types';

export const cleanHtml = (html: string) => htmlToPlainText(decode(html));

export const cleanNumber = (value: string) => {
    if (value == null || value === '') return 0;

    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatPrice = (price: number): string =>
    price.toFixed(0).replace('.', ',') + ',-';

export const formatPriceRange = (priceRange: ProductPriceRange, compact: boolean = true): string => {
    if (priceRange.min === priceRange.max) {
        return formatPrice(priceRange.min);
    }
    if (compact) {
        return `Fra ${formatPrice(priceRange.min)}`;
    }
    return `${formatPrice(priceRange.min)} - ${formatPrice(priceRange.max)}`;
};

/*
export const lighten = (color: string, amount: number) =>
    tinycolor(color).lighten(amount).toString();

export const darken = (color: string, amount: number) =>
    tinycolor(color).darken(amount).toString();

export const rgba = (color: string, alpha: number): string =>
    tinycolor(color).setAlpha(alpha).toString();
*/
import { parseDocument } from 'htmlparser2';

const isAllWhitespace = (str: string) => /^\s*$/.test(str);

export const htmlToPlainText = (html: string): string => {
    const dom = parseDocument(html);

    const walk = (nodes: any[]): string => {
        let text = '';
        nodes.forEach((node, index) => {
            if (node.type === 'text') {
                if (!isAllWhitespace(node.data)) {
                    text += node.data;
                }
            } else if (node.type === 'tag') {
                let childrenText = walk(node.children || []);
                if (node.name === 'p' || node.name === 'div') {
                    // Add double newline after paragraphs or divs, but only if they contain non-whitespace text.
                    if (!isAllWhitespace(childrenText)) {
                        text += childrenText + '\n\n';
                    }
                } else if (node.name === 'br') {
                    text += '\n';
                } else if (node.name === 'strong' || node.name === 'b') {
                    text += `**${childrenText}**`;
                } else {
                    text += childrenText;
                }
            }
        });
        return text;
    };

    // Process and clean up the final text
    let result = walk(dom.children);
    // Trim leading/trailing whitespace and collapse multiple newlines into a maximum of two
    return result.replace(/\n{3,}/g, '\n\n').trim();
};

export const getScaledImageUrl = (url: string, width: number, height: number): string | undefined => {
    if (!url || width === 0 || height === 0) {
        return undefined; // Return undefined if url is missing or size is not measured
    }
    try {
        const urlObject = new URL(url);
        // By setting the search, we remove any existing query params
        urlObject.search = `?fit=${width},${height}&ssl=1`;
        return urlObject.toString();
    } catch (error) {
        console.error('Invalid URL:', url);
        return undefined; // Return undefined for invalid URLs
    }
};
