import { decode } from 'he';
import { DimensionValue } from 'react-native';


export const cleanHtml = (html: string) => htmlToPlainText(decode(html));

export const cleanNumber = (value: string) => {
    if (value == null || value === '') return 0;

    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
};

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatPrice = (price: string): string => {
    const num = parseFloat(price) / 100;
    return num.toFixed(0).replace('.', ',') + ',-';
};

export const formatPriceRange = (priceRange: any, compact: boolean = true): string => {
    if (priceRange.min_amount === priceRange.max_amount) {
        return formatPrice(priceRange.min_amount);
    }
    if (compact) {
        return `Fra ${formatPrice(priceRange.min_amount)}`;
    }
    return `${formatPrice(priceRange.min_amount)} - ${formatPrice(priceRange.max_amount)}`;
};

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

const placeholderBase64 =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAMAAAC67D+PAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAEFJREFUCB1jYGBgYAAAAAQAAVcCkE0AAAAASUVORK5CYII=';

// Internal: parse DimensionValue into comparable units
// Not exported; used by image helpers below
const parseDim = (
    v: DimensionValue | undefined
): { type: 'px' | 'pct'; value: number } | null => {
    if (typeof v === 'number' && isFinite(v)) return { type: 'px', value: v };
    if (typeof v === 'string') {
        const s = v.trim();
        if (/^-?\d+(?:\.\d+)?%$/.test(s)) return { type: 'pct', value: parseFloat(s) };
        if (/^-?\d+(?:\.\d+)?$/.test(s)) return { type: 'px', value: parseFloat(s) };
    }
    return null;
};

export const getScaledImageUrl = (
    url: string,
    width?: DimensionValue,
    height?: DimensionValue,
    fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside' = 'cover'
): string => {
    const w = width != null ? parseDim(width) : null;
    const h = height != null ? parseDim(height) : null;

    const numWidth = w?.type === 'px' ? w.value : 0;
    const numHeight = h?.type === 'px' ? h.value : 0;

    if (!url) {
        return placeholderBase64;
    }

    // If we don't have any numeric pixel dimension, return the original URL (no resize)
    if (!numWidth && !numHeight) {
        try {
            // Still validate URL format
            const urlObject = new URL(url);
            return urlObject.toString();
        } catch (error) {
            console.error('Invalid URL:', url);
            return placeholderBase64;
        }
    }

    try {
        const urlObject = new URL(url);
        const params = new URLSearchParams();

        if (numWidth && numHeight) {
            params.set('resize', `${numWidth},${numHeight}`);
        } else if (numWidth) {
            params.set('w', String(numWidth));
        } else if (numHeight) {
            params.set('h', String(numHeight));
        }

        params.set('fit', fit);
        params.set('ssl', '1');

        urlObject.search = params.toString();
        return urlObject.toString();
    } catch (error) {
        console.error('Invalid URL:', url);
        return placeholderBase64;
    }
};

export const getAspectRatio = (width: DimensionValue | undefined, height: DimensionValue | undefined): number => {
    const w = parseDim(width);
    const h = parseDim(height);

    if (!w || !h) return 1;
    if (h.value === 0) return 1;

    // Only compute when comparable units
    if (w.type === h.type) {
        return w.value / h.value;
    }

    // Mixed units (px vs %) — ambiguous; fallback
    return 1;
};