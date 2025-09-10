// domain/ProductCategory.ts
import { StoreImage, type StoreImageData } from "./StoreImage";

export type CategoryRef = {
  id: number;
  name: string;
};

export type CategoryRefData = {
  id: number;
  name: string;
};

export type ProductCategoryData = {
  id: number;
  name: string;
  parent: number;
  image: StoreImageData;
  description?: string | null;
  slug: string;
  count: number;
};

type NormalizedProductCategory = {
  id: number;
  name: string;
  parent: number;
  image: StoreImage;
  description: string;
  slug: string;
  count: number;
};

export class ProductCategory implements NormalizedProductCategory {
  readonly id: number;
  readonly name: string;
  readonly parent: number;
  readonly image: StoreImage;
  readonly description: string;
  readonly slug: string;
  readonly count: number;
  private constructor(data: NormalizedProductCategory) {
    this.id = data.id;
    this.name = data.name;
    this.parent = data.parent;
    this.image = data.image;
    this.description = data.description;
    this.slug = data.slug;
    this.count = data.count;
  } /** Woo: top-level categories have parent === 0 */
  get isTopLevel(): boolean {
    return this.parent === 0;
  } /** Your existing sentinel rule */
  shouldDisplay(): boolean {
    return this.description !== "#";
  }
  toString(): string {
    return `Category ${this.id}: ${this.name}`;
  }
  static create(data: ProductCategoryData): ProductCategory {
    return new ProductCategory({
      id: data.id,
      name: data.name,
      parent: data.parent,
      image: StoreImage.create(data.image),
      description: data.description ?? "",
      slug: data.slug,
      count: data.count,
    });
  } /** Optional synthetic root for UI (breadcrumbs etc.) */
  static readonly ROOT = Object.freeze(
    ProductCategory.create({
      id: 0,
      name: "Hjem",
      parent: -1,
      image: null,
      description: "",
      slug: "",
      count: 0,
    }) as ProductCategory
  );
}
