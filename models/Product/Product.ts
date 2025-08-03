import { Category, CategoryData } from '../Category';
import { Image } from '../Image';
import { ProductAttribute, ProductAttributeData } from './ProductAttribute';
import { ProductPrices } from './ProductPrices';
import { VariationReference } from './VariationReference';

export type ProductType = 'simple' | 'variable' | 'variation';

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
  related_ids: number[];
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
  _attributes: ProductAttribute[];
  related_ids: number[];
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
    this._attributes = (data.attributes || []).map((attr) => new ProductAttribute(attr));
    this.variations = data.variations;
    this.parent_id = data.parent_id;
    this.type = data.type;
    this.is_in_stock = data.is_in_stock;
    this.is_purchasable = data.is_purchasable;
    this.has_options = data.has_options;
    this.related_ids = data.related_ids;
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

  get attributes(): ProductAttribute[] {
    return this._attributes.map((attribute) => {

      console.log(attribute);

      const newAttribute = new ProductAttribute(attribute);
      newAttribute.terms.sort((a, b) => {
        const numA = parseInt(a.slug, 10);
        const numB = parseInt(b.slug, 10);

        if (!isNaN(numA) && !isNaN(numB)) {
          if (numA !== numB) {
            return numA - numB;
          }
        }

        return a.slug.localeCompare(b.slug);
      });
      return newAttribute;
    });
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


