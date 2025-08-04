import { Image } from './Image';

export interface ProductCategoryData {
  id: number;
  name: string;
  parent: number;
  image: Image;
  description: string;
  slug: string;
}

export class ProductCategory implements ProductCategoryData {
  id: number;
  name: string;
  parent: number;
  image: Image;
  description: string;
  slug: string;

  constructor(data: ProductCategoryData) {
    this.id = data.id;
    this.name = data.name;
    this.parent = data.parent;
    this.image = data.image;
    this.description = data.description;
    this.slug = data.slug;
  }

  shouldDisplay(): boolean {
    return this.description !== '#';
  }


  toString() {
    return 'Category ' + this.id + ': ' + this.name;
  }
}

export const mapToCategory = (item: any): ProductCategory => new ProductCategory({
  id: item.id,
  name: item.name,
  parent: item.parent,
  image: item.image,
  description: item.description,
  slug: item.slug,
});
