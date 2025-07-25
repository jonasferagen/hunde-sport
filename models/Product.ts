import { Category, CategoryData } from './Category';
import { Image } from './Image';
import { ProductAttribute, ProductAttributeData } from './ProductAttribute';

export type ProductType = 'simple' | 'variable' | 'variation';

export interface ProductPriceRange {
  min: number;
  max: number;
}

export interface ProductData {
  id: number;
  name: string;
  price: number,
  regular_price: number,
  sale_price: number,
  on_sale: boolean,
  featured: boolean,
  stock_status: string,
  description: string;
  short_description: string;
  categories: CategoryData[];
  images: Image[];
  attributes: ProductAttributeData[];
  variations: number[];
  related_ids: number[];
  type: ProductType;
  default_attributes: ProductAttributeData[];
  parent_id: number;
}

export class Product {
  id: number;
  name: string;
  price: number;
  regular_price: number;
  sale_price: number;
  on_sale: boolean;
  featured: boolean;
  stock_status: string;
  description: string;
  short_description: string;
  categories: Category[];
  images: Image[];
  attributes: ProductAttribute[];
  variations: number[];
  variationsData: Product[] = [];
  related_ids: number[];
  type: ProductType;
  default_attributes: ProductAttribute[];
  parent_id: number;

  constructor(data: ProductData) {
    if (this.constructor === Product && data.type === 'variation') {
      throw new Error('Cannot construct Product with type "variation". Use ProductVariation instead.');
    }

    this.id = data.id;
    this.name = data.name;
    this.on_sale = data.on_sale;
    this.price = data.price;
    this.regular_price = data.regular_price;
    this.sale_price = data.sale_price;
    this.featured = data.featured;
    this.stock_status = data.stock_status;
    this.description = data.description;
    this.short_description = data.short_description;
    this.categories = data.categories.map(category => new Category(category));
    this.variations = data.variations;
    this.related_ids = data.related_ids;
    this.type = data.type;
    this.attributes = (data.attributes || []).map(attr => new ProductAttribute(attr));
    this.default_attributes = (data.default_attributes || []).map(attr => new ProductAttribute(attr));
    this.parent_id = data.parent_id;

    // Add a placeholder image if none exist
    this.images = data.images || [];
    if (this.images.length === 0) {
      this.images.push({
        id: 0,
        src: 'https://placehold.co/600x400',
        name: 'placeholder',
        alt: 'placeholder image',
      });
    }
  }

  get image(): Image {
    return this.images[0];
  }

  toString() {
    return 'Product ' + this.id + ': ' + this.name;
  }
}
