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
