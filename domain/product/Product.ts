// domain/product/Product.ts
import { CustomField, CustomFieldData } from "@/domain/extensions/CustomField";
import { ProductPrices } from "@/domain/pricing";
import { StoreImage, StoreImageData } from "@/domain/store-image/StoreImage";
import { cleanHtml } from "@/lib/format";

export interface CategoryRefData {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface ProductAvailability {
  isInStock: boolean;
  isPurchasable: boolean;
  isOnSale: boolean;
  isOnBackOrder: boolean;
}

export type ProductData = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  images: StoreImageData[];
  categories: CategoryRefData[];
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
  images: StoreImage[];
  categories: CategoryRefData[];
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  featured: boolean;
  parent: number;
  type: "simple" | "variable" | "variation";
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
  readonly images: StoreImage[];
  readonly prices: ProductPrices;
  readonly on_sale: boolean;
  readonly featured: boolean;
  readonly is_in_stock: boolean;
  readonly is_purchasable: boolean;
  readonly is_on_backorder: boolean;
  readonly categories: CategoryRefData[];
  readonly type: "simple" | "variable" | "variation";
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

  static mapBase(
    raw: ProductData,
    forceType: ProductData["type"]
  ): NormalizedProduct {
    return {
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      permalink: raw.permalink,
      description: raw.description ?? "",
      short_description: raw.short_description ?? "",
      images: (raw.images ?? [StoreImage.DEFAULT]).map(StoreImage.create),
      categories: raw.categories,
      prices: raw.prices,
      on_sale: raw.on_sale ?? false,
      featured: raw.featured ?? false,
      is_in_stock: raw.is_in_stock ?? false,
      is_purchasable: raw.is_purchasable ?? false,
      is_on_backorder: raw.is_on_backorder ?? false,
      parent: raw.parent,
      type: forceType,
      extensions: {
        customFields: (raw.extensions?.app_fpf?.fields ?? [])
          .map(CustomField.create)
          .filter((f) => !!f),
      },
    };
  }

  static create(data: ProductData) {
    /* eslint-disable @typescript-eslint/no-require-imports */

    switch (data.type) {
      case "simple":
        const { SimpleProduct } =
          require("./SimpleProduct") as typeof import("./SimpleProduct");
        return SimpleProduct.create(data);

      case "variable":
        const { VariableProduct } =
          require("./VariableProduct") as typeof import("./VariableProduct");
        return VariableProduct.create(data);

      case "variation":
        const { ProductVariation } =
          require("./ProductVariation") as typeof import("./ProductVariation");
        return ProductVariation.create(data);
    }

    /* eslint-enable @typescript-eslint/no-require-imports */
  }
}
