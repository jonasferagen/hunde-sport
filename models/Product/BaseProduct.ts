import { cleanHtml } from "@/utils/helpers";
import { ProductCategory } from "../ProductCategory";
import { ProductAttribute } from "./ProductAttribute";
import { ProductPrices } from "./ProductPrices";
import { ApiVariationAttribute, ProductVariation } from "./ProductVariation";

export interface ProductImage {
    id: number;
    src: string;
    name: string;
    alt: string;
}

export type VariationReference = {
    id: number;
    attributes: ApiVariationAttribute[];
};

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
    is_on_backorder: boolean;
    parent: number;
    categories: ProductCategory[];
    type: 'simple' | 'variable' | 'variation';
    attributes: ProductAttribute[];
    variations: VariationReference[];
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
    is_on_backorder: boolean;
    parent: number;
    categories: ProductCategory[];
    type: 'simple' | 'variable' | 'variation';
    attributes: ProductAttribute[];
    variations: VariationReference[];

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
        this.is_on_backorder = data.is_on_backorder;
        this.parent = data.parent;
        this.categories = data.categories;
        this.type = data.type;
        this.attributes = (data.attributes || []).map((attr) => new ProductAttribute(attr));
        this.variations = data.variations || [];
    }

    get featuredImage(): ProductImage {
        return this.images[0];
    }

    get productVariation(): ProductVariation | undefined {
        throw new Error("productVariation called on BaseProduct")
    }
}
