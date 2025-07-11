import { decode } from 'he';
import tinycolor from 'tinycolor2';

export const cleanHtml = (html: string) => extractPlainText(decode(html));

export const formatPrice = (price: string): string =>
    Number(price).toFixed(0).replace('.', ',') + ',-';

export const lighten = (color: string, amount: number) =>
    tinycolor(color).lighten(amount).toString();

export const darken = (color: string, amount: number) =>
    tinycolor(color).darken(amount).toString();

export const rgba = (color: string, alpha: number): string =>
    tinycolor(color).setAlpha(alpha).toString();


import { parseDocument } from 'htmlparser2';

export const extractPlainText = (html: string) => {
    const dom = parseDocument(html);
    const walk = (nodes: any[]): string => {
        return nodes.map(node => {
            if (node.type === 'text') return node.data;
            if (node.name === 'br') return '\n';
            if (node.name === 'p') return walk(node.children) + '\n\n';
            if (node.name === 'strong' || node.name === 'b') return '**' + walk(node.children) + '**';
            return walk(node.children || []);
        }).join('');
    };
    return walk(dom.children).trim();
};
