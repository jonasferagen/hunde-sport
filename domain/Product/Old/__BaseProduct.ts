import { cleanHtml } from "@/lib/format";

import { ProductPrices } from "../../pricing";
import { ProductCategory } from "../../ProductCategory";
import { StoreImage } from "../../StoreImage";
import { ProductVariation, ProductVariationData } from "../ProductVariation";
import { SimpleProduct, SimpleProductData } from "../SimpleProduct";
import { VariableProduct } from "../VariableProduct";

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
  categories: ProductCategory[];
  type: "simple" | "variable" | "variation";

  constructor(data: BaseProductData) {
    this.id = data.id;
    this.name = cleanHtml(data.name);
    this.slug = data.slug;
    this.permalink = data.permalink;
    this.description = cleanHtml(data.description);
    this.short_description = cleanHtml(data.short_description);
    this.images = data.images;
    this.prices = data.prices;
    this.on_sale = data.on_sale;
    this.featured = data.featured;
    this.is_in_stock = data.is_in_stock;
    this.is_purchasable = data.is_purchasable;
    this.is_on_backorder = data.is_on_backorder;
    this.categories = data.categories;
    this.type = data.type;
  }

  get featuredImage(): StoreImage {
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

/*
  const productData: BaseProductData = {
    id: data.id,
    name: data.name,
    permalink: data.permalink,
    slug: data.slug,
    description: data.description,
    short_description: data.short_description || "",
    images: data.images || [],
    prices: data.prices,
    on_sale: data.on_sale,
    featured: data.featured || false,
    is_in_stock: data.is_in_stock,
    is_purchasable: data.is_purchasable,
    is_on_backorder: data.is_on_backorder,
    parent: data.parent,
    categories: data.categories || [],
    rawAttributes: data.attributes || [],
    rawVariations: data.variations || [],
    type: data.type,
  };
  */

export const mapToProduct = (data: any) => {
  return new SimpleProduct(data);

  /*
  const base = new BaseProduct(data);
  console.error(base.type);

  /*
  if (data.type === "variable") {
    return new VariableProduct(data);
  }

  if (data.type === "variation") {
    return new ProductVariation(data);
  }

  // All other types are treated as SimpleProduct
  return SimpleProduct.create(data); 
  */
};

export interface ProductAvailability {
  isInStock: boolean;
  isPurchasable: boolean;
  isOnBackOrder: boolean;
  isOnSale: boolean;
}
