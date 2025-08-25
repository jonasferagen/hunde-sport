
import { ProductPrices } from '@/domain/pricing';
import { cleanHtml } from "@/lib/helpers";
import { ProductCategory } from "../ProductCategory";
import { StoreImage } from "../StoreImage";
import { ProductAttribute } from "./ProductAttribute";

// The raw representation of an attribute as it comes from the initial product API response.
export type ApiVariationAttribute = {
    name: string; // The attribute's "nice" name, e.g., "Farge"
    value: string; // The selected term slug, e.g., "red"
};

export type VariationReference = {
    id: number;
    attributes: ApiVariationAttribute[];
};

export interface ProductAvailability {
    isInStock: boolean;
    isPurchasable: boolean;
    isOnBackOrder: boolean;
    isOnSale: boolean;
    isFree: boolean;
}


export interface BaseProductData {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    description: string;
    short_description: string;
    images: StoreImage[];
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
    variation: string;


}

export class BaseProduct<T extends BaseProductData> {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    description: string;
    short_description: string;
    images: StoreImage[];
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
    variation: string;
    priceKey: string;
    availabilityKey: string;

    constructor(data: T) {
        this.id = data.id;
        this.name = cleanHtml(data.name);
        this.slug = data.slug;
        this.permalink = data.permalink;
        this.description = cleanHtml(data.description);
        this.short_description = cleanHtml(data.short_description);
        this.images = (data.images && data.images.length > 0) ? data.images : [{
            id: 0,
            src: '',
            name: '',
            alt: '',
            thumbnail: '',
            srcset: '',
            sizes: '',
        }];
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
        this.variation = data.variation;

        const p = this.prices;

        // version keys (only fields that affect display)
        this.priceKey = [
            p.currency_code,
            p.price,
            p.sale_price,
            p.regular_price,
        ].join('|');

        this.availabilityKey = [
            this.is_in_stock ? 1 : 0,
            this.is_purchasable ? 1 : 0,
            this.is_on_backorder ? 1 : 0,
            this.on_sale ? 1 : 0,
        ].join('');


    }

    get featuredImage(): StoreImage {
        return this.images[0];
    }

    get isVariable(): boolean {
        return this.type === 'variable';
    }

    get availability(): ProductAvailability {
        return {
            isFree: this.prices.price === '0',
            isInStock: this.is_in_stock,
            isPurchasable: this.is_purchasable,
            isOnSale: this.on_sale,
            isOnBackOrder: this.is_on_backorder,
        };
    }

}
