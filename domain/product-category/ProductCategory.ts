// domain/ProductCategory.ts
import { StoreImage, type StoreImageData } from "../store-image/StoreImage";

type ProductCategoryData = {
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
  static create(raw: ProductCategoryData): ProductCategory {
    return new ProductCategory({
      id: raw.id,
      name: raw.name,
      parent: raw.parent,
      image: StoreImage.create(raw.image),
      description: raw.description ?? "",
      slug: raw.slug,
      count: raw.count,
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
