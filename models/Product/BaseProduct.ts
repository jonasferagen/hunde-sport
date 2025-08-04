import { cleanHtml } from "@/utils/helpers";

export interface Image {
    id: number;
    src: string;
    name: string;
    alt: string;
}

export interface Price {
    price: string;
    regular_price: string;
    sale_price: string;
}

export interface BaseProductData {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    description: string;
    short_description: string;
    images: Image[];
    prices: Price;
    is_in_stock: boolean;
    type: 'simple' | 'variable' | 'variation';
}

export class BaseProduct<T extends BaseProductData> {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    description: string;
    shortDescription: string;
    images: Image[];
    prices: Price;
    isInStock: boolean;
    type: 'simple' | 'variable' | 'variation';

    constructor(data: T) {
        this.id = data.id;
        this.name = cleanHtml(data.name);
        this.slug = data.slug;
        this.permalink = data.permalink;
        this.description = cleanHtml(data.description || 'Ingen beskrivelse tilgjengelig');
        this.shortDescription = cleanHtml(data.short_description || 'Ingen beskrivelse tilgjengelig');
        this.images = data.images;
        this.prices = data.prices;
        this.isInStock = data.is_in_stock;
        this.type = data.type;
    }

    get featuredImage(): Image | null {
        return this.images[0] ?? null;
    }
}
