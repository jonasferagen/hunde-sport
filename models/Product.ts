import { Category, CategoryData } from './Category';
import { Image } from './Image';
import { ProductAttribute, ProductAttributeData } from './ProductAttribute';

export type ProductType = 'simple' | 'variable' | 'variation';

export interface ProductPrices {
  currency_code: string;
  currency_symbol: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: { min_amount: string; max_amount: string } | null;
}

export interface VariationReference {
  id: number;
  attributes: { name: string; value: string }[];
}

export interface ProductData {
  id: number;
  name: string;
  permalink: string;
  slug: string;
  on_sale: boolean;
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price_html: string;
  prices: ProductPrices;
  images: Image[];
  categories: CategoryData[];
  tags: { id: number; name: string; slug: string }[];
  attributes: ProductAttributeData[];
  variations: VariationReference[];
  parent_id: number;
  type: ProductType;
  is_in_stock: boolean;
  is_purchasable: boolean;
  has_options: boolean;
}

export abstract class Product {
  id: number;
  name: string;
  permalink: string;
  slug: string;
  on_sale: boolean;
  featured: boolean;
  _description: string;
  _short_description: string;
  sku: string;
  price_html: string;
  prices: ProductPrices;
  images: Image[];
  categories: Category[];
  tags: { id: number; name: string; slug: string }[];
  attributes: ProductAttribute[];
  variations: VariationReference[];
  variationsData: Product[] = [];
  parent_id: number;
  type: ProductType;
  is_in_stock: boolean;
  is_purchasable: boolean;
  has_options: boolean;

  constructor(data: ProductData) {
    this.id = data.id;
    this.name = data.name;
    this.permalink = data.permalink;
    this.slug = data.slug;
    this.on_sale = data.on_sale;
    this.featured = data.featured;
    this._description = data.description;
    this._short_description = data.short_description;
    this.sku = data.sku;
    this.price_html = data.price_html;
    this.prices = data.prices;
    this.images = data.images || [];
    this.categories = data.categories.map((category) => new Category(category));
    this.tags = data.tags;
    this.attributes = (data.attributes || []).map((attr) => new ProductAttribute(attr));
    this.variations = data.variations;
    this.parent_id = data.parent_id;
    this.type = data.type;
    this.is_in_stock = data.is_in_stock;
    this.is_purchasable = data.is_purchasable;
    this.has_options = data.has_options;

    // Add a placeholder image if none exist
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

  get description(): string {
    return this._description || 'Ingen beskrivelse tilgjengelig';
  }

  get short_description(): string {
    return this._short_description || 'Ingen beskrivelse tilgjengelig';
  }

  isInStock(): boolean {
    return this.is_in_stock;
  }

  abstract hasVariations(): boolean;

  abstract isPurchasable(): boolean;

  toString() {
    return 'Product ' + this.id + ': ' + this.name;
  }
}

export class SimpleProduct extends Product {
  constructor(data: ProductData) {
    if (data.type !== 'simple') {
      throw new Error('Cannot construct SimpleProduct with type other than "simple".');
    }
    super(data);
    this.type = 'simple';
  }

  hasVariations(): boolean {
    return false;
  }

  isPurchasable(): boolean {
    return this.isInStock();
  }
}

export class VariableProduct extends Product {
  constructor(data: ProductData) {
    if (data.type !== 'variable') {
      throw new Error('Cannot construct VariableProduct with type other than "variable".');
    }
    super(data);
    this.type = 'variable';
  }

  hasVariations(): boolean {
    return true;
  }

  isPurchasable(): boolean {
    return false;
  }
}

export class ProductVariation extends Product {
  type: 'variation' = 'variation';
  variation_attributes?: { name: string; value: string }[];

  constructor(data: ProductData) {
    if (data.type !== 'variation') {
      throw new Error('Cannot construct ProductVariation with type other than "variation".');
    }
    super(data);
  }

  hasVariations(): boolean {
    return false;
  }

  isPurchasable(): boolean {
    return this.isInStock();
  }
}
