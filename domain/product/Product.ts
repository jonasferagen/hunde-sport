// domain/product/Product.ts
import { CustomField, type CustomFieldData } from "@/domain/CustomField";
import { PriceBook } from "@/domain/pricing/PriceBook";
import type { ProductPrices } from "@/domain/pricing/types";
import type { AttributeData } from "@/domain/product-attributes/Attribute";
import type { VariationData } from "@/domain/product-attributes/Variation";
import { ProductCategoryRef, type ProductCategoryRefData } from "@/domain/ProductCategory";
import { StoreImage, type StoreImageData } from "@/domain/StoreImage";
import { toNonEmptyArray } from "@/lib/array";
import { cleanHtml } from "@/lib/formatters";
import type { NonEmptyArray } from "@/types";

export interface ProductAvailability {
  isInStock: boolean;
  isPurchasable: boolean;
  isOnSale: boolean;
  isOnBackOrder: boolean;
}

type ProductType = 'simple' | 'variable' | 'variation'; 


export type ProductData = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  images: StoreImageData[];
  categories: ProductCategoryRefData[];
  prices: ProductPrices;
  on_sale: boolean;
  featured: boolean;
  is_in_stock: boolean;
  is_purchasable: boolean;
  is_on_backorder: boolean;
  parent: number;
  type: NormalizedProduct["type"];
  extensions: {
    app_fpf?: {
      fields?: CustomFieldData[];
    };
  };
  attributes: AttributeData[];
  variations: VariationData[];
};

type NormalizedProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: ProductPrices;
  images: NonEmptyArray<StoreImage>;
  categories: NonEmptyArray<ProductCategoryRef>;
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  featured: boolean;
  parent: number;
  type: ProductType;
  extensions: {
    customFields?: CustomField[];
  };
};
export abstract class Product implements NormalizedProduct {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly permalink: string;
  readonly description: string;
  readonly short_description: string;
  readonly images:NonEmptyArray<StoreImage>; 
  readonly categories: NonEmptyArray<ProductCategoryRef>;
  readonly prices: ProductPrices;
  readonly on_sale: boolean;
  readonly featured: boolean;
  readonly is_in_stock: boolean;
  readonly is_purchasable: boolean;
  readonly is_on_backorder: boolean;
  readonly type: ProductType;
  readonly parent: number;

  readonly extensions: {
    customFields?: CustomField[];
  };

  protected constructor(data: NormalizedProduct) {
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
    this.parent = data.parent;
    this.extensions = data.extensions;

    if (data.images.length === 0) {
      throw new Error("Product must have at least one image");
    }
  }

  get isVariable(): boolean {
    return this.type === "variable";
  }
  get isSimple(): boolean {
    return this.type === "simple";
  }
  get isVariation(): boolean {
    return this.type === "variation";
  }
  get customFields(): CustomField[] {
    return this.extensions?.customFields ?? [];
  }
  get hasCustomFields(): boolean {
    return this.customFields.length > 0;
  }
  get priceBook() {
    return PriceBook.from(this.prices);
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
  static mapBase(
    data: ProductData,
    forceType: ProductData["type"]
  ): NormalizedProduct {


    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      permalink: data.permalink,
      description: data.description ?? "",
      short_description: data.short_description ?? "",
      images: toNonEmptyArray(data.images.map(StoreImage.create), StoreImage.DEFAULT),
      categories: toNonEmptyArray( data.categories.map(ProductCategoryRef.create), ProductCategoryRef.DEFAULT),
      prices: data.prices,
      on_sale: data.on_sale ?? false,
      featured: data.featured ?? false,
      is_in_stock: data.is_in_stock ?? false,
      is_purchasable: data.is_purchasable ?? false,
      is_on_backorder: data.is_on_backorder ?? false,
      parent: data.parent,
      type: forceType,
      extensions: {
        customFields: (data.extensions?.app_fpf?.fields ?? [])
          .map(CustomField.create)
          .filter((f) => !!f),
      },
    };
  }
  static create(data: ProductData) {
    // Lazy import to avoid Product ↔ createProduct ↔ subclass ↔ Product cycle
    const {
      createProduct,
    } = // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("./helpers/createProduct") as typeof import("./helpers/createProduct");
    return createProduct(data);
  }
}
