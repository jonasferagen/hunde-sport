// domain/Product/mapToProduct.ts

import { ProductPrices } from "@/domain/pricing";
import { BaseProductData, CategoryRef } from "@/domain/Product/BaseProduct";
import { ProductVariation } from "@/domain/Product/ProductVariation";
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import {
  RawAttribute,
  RawVariationRef,
  VariableProduct,
  VariableProductData,
} from "@/domain/Product/VariableProduct";
import { StoreImageData } from "@/domain/StoreImage";

type WooBase = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description?: string;
  description?: string;
  on_sale?: boolean;
  prices: ProductPrices;

  images?: StoreImageData[]; // raw; BaseProduct ensures [0]
  categories: CategoryRef[]; // reliable per your note

  is_purchasable?: boolean;
  is_in_stock?: boolean;
  is_on_backorder?: boolean;
  featured?: boolean;

  parent: number; // 0 for simple/variable; >0 for variation
};

type WooSimple = WooBase & { type: "simple"; parent: 0 };
type WooVariable = WooBase & {
  type: "variable";
  parent: 0;
  attributes?: RawAttribute[];
  variations?: RawVariationRef[];
};
type WooVariation = WooBase & {
  type: "variation";
  parent: number;
  variation?: string;
};

type AnyStoreProduct = WooSimple | WooVariable | WooVariation;
type AnyDomainProduct = SimpleProduct | VariableProduct | ProductVariation;

function mapBase(
  json: AnyStoreProduct,
  forceType: BaseProductData["type"]
): BaseProductData {
  return {
    id: json.id,
    name: json.name,
    slug: json.slug,
    permalink: json.permalink,
    description: json.description ?? "",
    short_description: json.short_description ?? "",
    images: json.images ?? [],
    categories: json.categories, // already good
    prices: json.prices,
    on_sale: json.on_sale ?? false,
    featured: json.featured ?? false,
    is_in_stock: json.is_in_stock ?? false,
    is_purchasable: json.is_purchasable ?? false,
    is_on_backorder: json.is_on_backorder ?? false,
    parent: json.parent,
    type: forceType,
  };
}

export function mapToProduct<T extends AnyStoreProduct>(
  json: T
): Extract<AnyDomainProduct, { type: T["type"] }> {
  switch (json.type) {
    case "simple": {
      const base = mapBase(json, "simple");
      return new SimpleProduct(base) as any;
    }
    case "variation": {
      const base = mapBase(json, "variation");
      return new ProductVariation({
        ...base,
        parent: json.parent,
        variation: json.variation,
        type: "variation",
      }) as any;
    }
    case "variable": {
      const base = mapBase(json, "variable");
      const data: VariableProductData = {
        ...base,
        type: "variable",
        parent: 0,
        attributes: json.attributes ?? [],
        variations: json.variations ?? [],
      };
      return new VariableProduct(data) as any;
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = json;
      throw new Error(`Unsupported product type: ${(json as any).type}`);
    }
  }
}
