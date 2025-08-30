import { ProductPrices } from "@/domain/pricing";
import {
  StoreImage,
  type StoreImageData,
} from "@/domain/store-image/StoreImage";
import { cleanHtml } from "@/lib/format";

export interface CategoryRef {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface ProductAvailability {
  isInStock: boolean;
  isPurchasable: boolean;
  isOnBackOrder: boolean;
  isOnSale: boolean;
}

/** Raw Store API shape */
export type RawBaseProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description?: string;
  description?: string;
  on_sale?: boolean;
  prices: ProductPrices;
  images?: StoreImageData[] | null;
  categories: CategoryRef[];
  is_purchasable?: boolean;
  is_in_stock?: boolean;
  is_on_backorder?: boolean;
  featured?: boolean;
  parent: number;
  type: "simple" | "variable" | "variation";
};

export abstract class Product {
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

  /** Accept the normalized payload from mapBase */
  protected constructor(data: ReturnType<typeof Product.mapBase>) {
    this.id = data.id;
    this.name = cleanHtml(data.name);
    this.slug = data.slug;
    this.permalink = data.permalink;
    this.description = cleanHtml(data.description);
    this.short_description = cleanHtml(data.short_description);

    const imgs = (data.images ?? []).map((img) => StoreImage.fromMaybe(img));
    this.images = imgs.length > 0 ? imgs : [StoreImage.DEFAULT];

    this.prices = data.prices;
    this.on_sale = data.on_sale ?? false;
    this.featured = data.featured ?? false;
    this.is_in_stock = data.is_in_stock ?? false;
    this.is_purchasable = data.is_purchasable ?? false;
    this.is_on_backorder = data.is_on_backorder ?? false;
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

  get isVariable(): boolean {
    return this.type === "variable";
  }
  get isSimple(): boolean {
    return this.type === "simple";
  }
  get isVariation(): boolean {
    return this.type === "variation";
  }

  /** shared normalizer for subclasses */
  static mapBase(json: RawBaseProduct, forceType: RawBaseProduct["type"]) {
    return {
      id: json.id,
      name: json.name,
      slug: json.slug,
      permalink: json.permalink,
      description: json.description ?? "",
      short_description: json.short_description ?? "",
      images: json.images ?? [],
      categories: json.categories,
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

  /** Static factory: raw Store API → concrete Product (simple | variable | variation) */
  /* eslint-disable @typescript-eslint/no-require-imports */
  static fromRaw(raw: RawBaseProduct) {
    const { productFromRaw } =
      require("./ProductFactory") as typeof import("./ProductFactory");
    return productFromRaw(raw);
  }
  /* eslint-enable @typescript-eslint/no-require-imports */
}
