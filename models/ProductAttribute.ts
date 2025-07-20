import { ProductAttributeOption } from './ProductAttributeOption';

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

export class ProductAttribute {
  id: number;
  name: string;
  slug: string;
  variation: boolean;
  options: ProductAttributeOption[];
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
    }).map((option: string) => new ProductAttributeOption(option));
  }

  get label(): string {
    if (!this.name) return '';
    return this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
}
