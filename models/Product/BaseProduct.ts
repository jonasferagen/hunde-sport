import { cleanHtml } from "@/utils/helpers";
import { ProductCategory } from "../ProductCategory";
import { ProductPrices } from "./ProductPrices";
import { ProductVariation } from "./ProductVariation";

export interface ProductImage {
    id: number;
    src: string;
    name: string;
    alt: string;
}

export interface ProductTag {
    id: number;
    name: string;
    slug: string;
}

export interface BaseProductData {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    description: string;
    short_description: string;
    images: ProductImage[];
    prices: ProductPrices;
    on_sale: boolean;
    featured: boolean;
    is_in_stock: boolean;
    is_purchasable: boolean;
    categories: ProductCategory[];
    tags: ProductTag[];
    type: 'simple' | 'variable' | 'variation';
    related_ids: number[];
}

export class BaseProduct<T extends BaseProductData> {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    description: string;
    short_description: string;
    images: ProductImage[];
    prices: ProductPrices;
    on_sale: boolean;
    featured: boolean;
    is_in_stock: boolean;
    is_purchasable: boolean;
    categories: ProductCategory[];
    tags: ProductTag[];
    type: 'simple' | 'variable' | 'variation';
    related_ids: number[];

    constructor(data: T) {
        this.id = data.id;
        this.name = cleanHtml(data.name);
        this.slug = data.slug;
        this.permalink = data.permalink;
        this.description = cleanHtml(data.description || 'Ingen beskrivelse tilgjengelig');
        this.short_description = cleanHtml(data.short_description || 'Ingen beskrivelse tilgjengelig');
        this.images = data.images;
        this.prices = data.prices;
        this.on_sale = data.on_sale;
        this.featured = data.featured;
        this.is_in_stock = data.is_in_stock;
        this.is_purchasable = data.is_purchasable;
        this.categories = data.categories;
        this.tags = data.tags;
        this.type = data.type;
        this.related_ids = data.related_ids;
    }

    get featuredImage(): ProductImage {
        return this.images[0];
    }

    get productVariation(): ProductVariation | undefined {
        console.log("productVariation called on BaseProduct")
        return undefined;
    }



}
