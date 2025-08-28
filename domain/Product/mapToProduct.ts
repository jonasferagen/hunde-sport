// domain/Product/mapToProduct.ts
import { BaseProductData, Category } from "@/domain/Product/BaseProduct";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import {
  RawAttribute,
  RawVariationRef,
  VariableProduct,
  VariableProductData,
} from "@/domain/Product/VariableProduct";
import { StoreImage } from "@/domain/StoreImage";

import { ProductPrices } from "../pricing";

/** Internal: minimal common WC Store API shape */
type WooBase = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description?: string;
  description?: string;
  on_sale?: boolean;
  prices: ProductPrices;
  images?: StoreImage[];
  categories?: { id: number; name: string; slug: string; link?: string }[];
  is_purchasable?: boolean;
  is_in_stock?: boolean;
  is_on_backorder?: boolean;
  parent?: number;
  featured?: boolean;
};
/** Internal per-type inputs */
type WooSimple = WooBase & { type: "simple" };
type WooVariation = WooBase & {
  type: "variation";
  parent: number;
  variation?: string;
};
type WooVariable = WooBase & {
  type: "variable";
  parent?: 0;
  attributes?: RawAttribute[];
  variations?: RawVariationRef[];
};

type AnyStoreProduct = WooSimple | WooVariation | WooVariable;

/** Domain union to compute precise return type */
type AnyDomainProduct = SimpleProduct | ProductVariation | VariableProduct;

/** Helpers */
function toCategories(cats?: WooBase["categories"]): Category[] {
  return (cats ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    link: c.link,
  }));
}

function mapBase(
  json: AnyStoreProduct,
  forceType: BaseProductData["type"],
  parentFallback?: number
): BaseProductData {
  return {
    id: json.id,
    name: json.name,
    slug: json.slug,
    permalink: json.permalink,
    description: json.description ?? "",
    short_description: json.short_description ?? "",
    images: json.images ?? [],
    prices: json.prices,
    on_sale: json.on_sale ?? false,
    featured: json.featured ?? false,
    is_in_stock: json.is_in_stock ?? false,
    is_purchasable: json.is_purchasable ?? false,
    is_on_backorder: json.is_on_backorder ?? false,
    categories: toCategories(json.categories),
    parent: json.parent ?? parentFallback ?? 0,
    type: forceType,
  };
}

/**
 * Single generic entry point.
 * - No overloads
 * - Precise return type inferred from input `type`
 */
export function mapToProduct<T extends AnyStoreProduct>(
  json: T
): Extract<AnyDomainProduct, { type: T["type"] }> {
  switch (json.type) {
    case "simple": {
      const base = mapBase(json, "simple", 0);
      return new SimpleProduct(base) as Extract<
        AnyDomainProduct,
        { type: T["type"] }
      >;
    }
    case "variation": {
      const base = mapBase(json, "variation");
      return new ProductVariation({
        ...base,
        parent: json.parent,
        variation: json.variation,
        type: "variation",
      }) as Extract<AnyDomainProduct, { type: T["type"] }>;
    }
    case "variable": {
      const base = mapBase(json, "variable", 0);
      const data: VariableProductData = {
        ...base,
        type: "variable",
        parent: 0,
        attributes: json.attributes ?? [],
        variations: json.variations ?? [],
      };
      return new VariableProduct(data) as Extract<
        AnyDomainProduct,
        { type: T["type"] }
      >;
    }
    default: {
      // Exhaustiveness + readable error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = json;
      throw new Error(`Unsupported product type: ${(json as any).type}`);
    }
  }
}
