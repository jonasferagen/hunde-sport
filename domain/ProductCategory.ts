// domain/ProductCategory.ts
import { StoreImage, type StoreImageData } from "./StoreImage";

export type ProductCategoryRefData = {
  id: number;
  name: string;
};

export class ProductCategoryRef  {
  id: number;
  name: string;

  private constructor(data: ProductCategoryRefData) {
    this.id = data.id;
    this.name = data.name;
  }

  static create(data: ProductCategoryRefData) {
    return new ProductCategoryRef(data);
  }

  static readonly DEFAULT = Object.freeze(
    ProductCategoryRef.create({
      id : 0,
      name: "Hjem",
    }) as ProductCategoryRef);
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
  } 
  /** Synthetic root for UI (breadcrumbs etc.) */
  static readonly DEFAULT = Object.freeze(
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
