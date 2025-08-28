// domain/product/BaseProduct.ts
import { cleanHtml } from "@/lib/format";

import { ProductPrices } from "../pricing";
import { StoreImage, StoreImageData } from "../StoreImage";

export interface CategoryRef {
  id: number;
  name: string;
  slug: string;
  link: string; // now required per your note
}

export interface ProductAvailability {
  isInStock: boolean;
  isPurchasable: boolean;
  isOnBackOrder: boolean;
  isOnSale: boolean;
}

export interface BaseProductData {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  images: StoreImageData[]; // raw StoreImageData[]
  prices: ProductPrices;
  on_sale: boolean;
  featured: boolean;
  is_in_stock: boolean;
  is_purchasable: boolean;
  is_on_backorder: boolean;
  parent: number;
  categories: CategoryRef[]; // already reliable, no sanitization needed
  type: "simple" | "variable" | "variation";
}

export class BaseProduct {
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
  categories: CategoryRef[];
  type: "simple" | "variable" | "variation";

  constructor(data: BaseProductData) {
    this.id = data.id;
    this.name = cleanHtml(data.name);
    this.slug = data.slug;
    this.permalink = data.permalink;
    this.description = cleanHtml(data.description);
    this.short_description = cleanHtml(data.short_description);

    // Images: map raw → StoreImage, ensure at least one
    const imgs = (data.images ?? []).map((img) => new StoreImage(img));
    this.images = imgs.length > 0 ? imgs : [StoreImage.DEFAULT];

    this.prices = data.prices;
    this.on_sale = data.on_sale;
    this.featured = data.featured;
    this.is_in_stock = data.is_in_stock;
    this.is_purchasable = data.is_purchasable;
    this.is_on_backorder = data.is_on_backorder;

    // Categories: already reliable
    this.categories = data.categories;

    this.type = data.type;
  }

  get featuredImage() {
    return this.images[0];
  }

  get availability(): ProductAvailability {
    return {
      isInStock: this.is_in_stock,
      isPurchasable: this.is_purchasable,
      isOnSale: this.on_sale,
      isOnBackOrder: this.is_on_backorder,
    };
  }
}

// (Optional) re-export here if you really want this path to expose it:
//export { mapToProduct } from "./mapToProduct";
