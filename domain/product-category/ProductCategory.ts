// domain/product/ProductCategory.ts
import {
  type RawStoreImage,
  StoreImage,
} from "@/domain/store-image/StoreImage";

export interface RawStoreCategory {
  id?: number;
  name?: string;
  parent?: number;
  image?: RawStoreImage | null;
  description?: string | null;
  slug?: string;
  count?: number;
}

export interface ProductCategoryData {
  id: number;
  name: string;
  parent: number;
  image: StoreImage;
  description: string;
  slug: string;
  count: number;
}

export class ProductCategory implements ProductCategoryData {
  readonly id: number;
  readonly name: string;
  readonly parent: number;
  readonly image: StoreImage;
  readonly description: string;
  readonly slug: string;
  readonly count: number;

  private constructor(data: ProductCategoryData) {
    this.id = data.id;
    this.name = data.name;
    this.parent = data.parent;
    this.image = data.image;
    this.description = data.description;
    this.slug = data.slug;
    this.count = data.count;
  }

  get isTopLevel(): boolean {
    return this.parent === 0;
  }
  shouldDisplay(): boolean {
    return this.description !== "#";
  }
  toString(): string {
    return `Category ${this.id}: ${this.name}`;
  }

  static fromRaw(raw: RawStoreCategory): ProductCategory {
    return new ProductCategory({
      id: raw.id ?? 0,
      name: raw.name ?? "",
      parent: raw.parent ?? 0,
      image: StoreImage.fromMaybe(raw.image),
      description: raw.description ?? "",
      slug: raw.slug ?? "",
      count: raw.count ?? 0,
    });
  }

  static readonly ROOT = new ProductCategory({
    id: 0,
    name: "Hjem",
    parent: -1,
    image: StoreImage.DEFAULT,
    description: "",
    slug: "",
    count: 0,
  });
}
