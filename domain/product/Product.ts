// domain/product/Product.ts
import {
  CustomField,
  type CustomFieldData,
} from "@/domain/custom-fields/CustomField";
import { ProductPrices } from "@/domain/pricing";
import { StoreImage, StoreImageData } from "@/domain/store-image/StoreImage";
import { cleanHtml } from "@/lib/format";

export interface CategoryRef {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export type ProductData = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  images: StoreImageData[];
  categories: CategoryRef[];
  prices: ProductPrices;
  on_sale: boolean;
  featured: boolean;
  is_in_stock: boolean;
  is_purchasable: boolean;
  is_on_backorder: boolean;
  parent: number;
  type: IProduct["type"];
  extensions?: {
    app_fpf?: {
      fields?: CustomFieldData[];
    };
  };
};

interface IProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: ProductPrices;
  images: StoreImage[];
  categories: CategoryRef[];
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  featured: boolean;
  parent: number;
  type: "simple" | "variable" | "variation";
  customFields: CustomField[];
}

export abstract class Product implements IProduct {
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
  readonly categories: CategoryRef[];
  readonly type: "simple" | "variable" | "variation";
  readonly parent: number;

  readonly _customFields: CustomField[];

  protected constructor(data: IProduct) {
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
    this._customFields = data.customFields;
  }

  get featuredImage(): StoreImage {
    return this.images[0];
  }
  get availability() {
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
    return this._customFields;
  }
  get hasCustomFields(): boolean {
    return this._customFields.length > 0;
  }

  static mapBase(json: ProductData, forceType: ProductData["type"]): IProduct {
    return {
      id: json.id,
      name: json.name,
      slug: json.slug,
      permalink: json.permalink,
      description: json.description ?? "",
      short_description: json.short_description ?? "",
      images: (json.images ?? [StoreImage.DEFAULT]).map(StoreImage.create),
      categories: json.categories,
      prices: json.prices,
      on_sale: json.on_sale ?? false,
      featured: json.featured ?? false,
      is_in_stock: json.is_in_stock ?? false,
      is_purchasable: json.is_purchasable ?? false,
      is_on_backorder: json.is_on_backorder ?? false,
      parent: json.parent,
      type: forceType,
      customFields: CustomField.listFromRaw(
        json.extensions?.app_fpf?.fields ?? []
      ),
    };
  }

  static create(raw: ProductData) {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { productFromRaw } =
      require("./ProductFactory") as typeof import("./ProductFactory");
    return productFromRaw(raw);
    /* eslint-enable @typescript-eslint/no-require-imports */
  }
}
