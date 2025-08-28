// domain/ProductCategory.ts
import { StoreImage } from "@/domain/StoreImage";

export interface ProductCategoryData {
  id: number;
  name: string;
  parent: number;
  image: StoreImage; // enforce the class here
  description: string;
  slug: string;
}

export class ProductCategory implements ProductCategoryData {
  id: number;
  name: string;
  parent: number;
  image: StoreImage;
  description: string;
  slug: string;

  constructor(data: ProductCategoryData) {
    this.id = data.id;
    this.name = data.name;
    this.parent = data.parent;
    this.image = data.image;
    this.description = data.description ?? "";
    this.slug = data.slug ?? "";
  }

  get isRoot(): boolean {
    return this.id === 0;
  }

  shouldDisplay(): boolean {
    return this.description !== "#";
  }

  toString() {
    return `Category ${this.id}: ${this.name}`;
  }

  /** Shared root instance */
  static readonly ROOT = new ProductCategory({
    id: 0,
    name: "Hjem",
    parent: -1,
    image: StoreImage.DEFAULT, // use the class default
    description: "",
    slug: "",
  });
}

/** ---- Mapper(s) ---- */

// Minimal Store API shape we care about. `image` can be null/undefined.
type StoreCategoryInput = {
  id: number;
  name: string;
  parent: number;
  image?: ConstructorParameters<typeof StoreImage>[0] | null; // StoreImageData | null
  description?: string | null;
  slug: string;
};

/** Single item */
export const mapToProductCategory = (
  item: StoreCategoryInput
): ProductCategory =>
  new ProductCategory({
    id: item.id,
    name: item.name,
    parent: item.parent,
    image: item.image ? new StoreImage(item.image) : StoreImage.DEFAULT,
    description: item.description ?? "",
    slug: item.slug,
  });

/** Convenience: list mapper */
export const mapToProductCategories = (
  items: StoreCategoryInput[]
): ProductCategory[] => items.map(mapToProductCategory);
