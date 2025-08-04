import { cleanHtml } from '@/utils/helpers';
import { Category, CategoryData } from '../Category';
import { Image } from '../Image';
import { ProductPrices } from './ProductPrices';

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
  price_html: string;
  prices: ProductPrices;
  images: Image[];
  categories: CategoryData[];
  tags: { id: number; name: string; slug: string }[];
  attributes: any[];
  variations: any[];
  related_ids: number[];
  parent: number;
  type: string;
  is_in_stock: boolean;
  is_purchasable: boolean;
  has_options: boolean;
  is_on_backorder: boolean;
  low_stock_remaining: number | null;
  variation: string;
}

export abstract class Product implements ProductData {
  readonly id: number;
  readonly name: string;
  readonly permalink: string;
  readonly slug: string;
  readonly on_sale: boolean;
  readonly featured: boolean;
  readonly description: string;
  readonly short_description: string;
  readonly price_html: string;
  readonly prices: ProductPrices;
  readonly images: Image[];
  readonly categories: Category[];
  readonly tags: { id: number; name: string; slug: string }[];
  readonly attributes: any[];
  readonly variations: any[];
  variationsData: Product[] = [];
  readonly related_ids: number[];
  readonly parent: number;
  readonly type: string;
  readonly is_in_stock: boolean;
  readonly is_purchasable: boolean;
  readonly has_options: boolean;
  readonly is_on_backorder: boolean;
  readonly low_stock_remaining: number | null;
  readonly variation: string;

  constructor(data: ProductData) {
    this.id = data.id;
    this.name = cleanHtml(data.name);
    this.permalink = data.permalink;
    this.slug = data.slug;
    this.on_sale = data.on_sale;
    this.featured = data.featured;
    this.description = cleanHtml(data.description || 'Ingen beskrivelse tilgjengelig');
    this.short_description = cleanHtml(data.short_description || 'Ingen kort beskrivelse tilgjengelig');
    this.price_html = data.price_html;
    this.prices = data.prices;
    this.images = data.images || [];
    this.categories = data.categories.map((category) => new Category(category));
    this.tags = data.tags;
    this.attributes = data.attributes;
    this.variations = data.variations;
    this.parent = data.parent;
    this.type = data.type;
    this.is_in_stock = data.is_in_stock;
    this.is_purchasable = data.is_purchasable;
    this.has_options = data.has_options;
    this.is_on_backorder = data.is_on_backorder;
    this.low_stock_remaining = data.low_stock_remaining;
    this.related_ids = data.related_ids;
    this.variation = data.variation;
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

  abstract hasVariations(): boolean;

  toString() {
    return 'Product ' + this.id + ': ' + this.name;
  }
}
