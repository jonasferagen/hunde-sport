import { ColorValue } from "react-native";

export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  status: number;
  headers: Headers;
};

export type ApiError = {
  message: string;
  status: number;
};

export interface Image {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface CategoryData {
  id: number;
  name: string;
  parent: number;
  image: Image;
  count: number;
}

export class Category implements CategoryData {
  id: number;
  name: string;
  parent: number;
  image: Image;
  count: number;

  constructor(data: CategoryData) {
    this.id = data.id;
    this.name = data.name;
    this.parent = data.parent;
    this.image = data.image;
    this.count = data.count;
  }

  toString() {
    return 'Category ' + this.id + ': ' + this.name;
  }
}

export interface ProductData {
  id: number;
  name: string;
  price: number,
  regular_price: number,
  sale_price: number,
  featured: boolean,
  stock_status: string,
  description: string;
  short_description: string;
  categories: CategoryData[];
  images: Image[];
  attributes: ProductAttributeData[];
  variations: number[];
  related_ids: number[];
  type: ProductType
}

export class Product implements ProductData {
  id: number;
  name: string;
  price: number;
  regular_price: number;
  sale_price: number;
  featured: boolean;
  stock_status: string;
  description: string;
  short_description: string;
  categories: Category[];
  images: Image[];
  attributes: ProductAttribute[];
  variations: number[];
  related_ids: number[];
  type: ProductType;

  constructor(data: ProductData) {
    this.id = data.id;
    this.name = data.name;
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

    // Initialize attributes
    this.attributes = (data.attributes || []).map(attr => new ProductAttribute(attr));
  }

  toString() {
    return 'Product ' + this.id + ': ' + this.name;
  }
}

export type ProductType = 'simple' | 'variable' | 'grouped' | 'external';

export interface ProductAttributeData {
  id: number;
  name: string;
  slug: string;
  variation: boolean;
  options: string[];
  option?: string;
  position: number;
  visible: boolean;
}

export class ProductAttribute implements ProductAttributeData {
  id: number;
  name: string;
  slug: string;
  variation: boolean;
  options: string[];
  option?: string;
  position: number;
  visible: boolean;

  constructor(data: ProductAttributeData) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.variation = data.variation;
    this.option = data.option;
    this.position = data.position;
    this.visible = data.visible;

    // Sort options with numeric priority
    this.options = (data.options || []).sort((a, b) => {
      const numA = parseInt(a.match(/^\d+/)?.[0] || '0', 10);
      const numB = parseInt(b.match(/^\d+/)?.[0] || '0', 10);

      if (numA !== 0 && numB !== 0 && numA !== numB) {
        return numA - numB;
      }

      return 0; // Preserve original order for non-numeric options
    }).map((option: string) => option.charAt(0).toUpperCase()
      + option.slice(1).toLowerCase());
  }
}

export interface Breadcrumb {
  id: number | null;
  name: string;
  type: 'category' | 'product' | 'home';
}

export interface ShoppingCartItem {
  product: Product;
  quantity: number;
}

export interface IStyleVariant {
  readonly backgroundColor: string;
  readonly text: {
    readonly primary: string;
    readonly secondary: string;
  };
  readonly borderColor: string;
  getGradient(amounts?: number[]): [ColorValue, ColorValue];
}
