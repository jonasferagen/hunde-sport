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

  getProductVariationAttributes(): ProductAttribute[] {
    return this.attributes.filter(attr => attr.variation);
  }

  get image(): Image {
    return this.images[0];
  }

  /**
   * Finds a matching variant from a list of products based on selected options.
   * @param variation - An array of variation products to search through.
   * @param selectedOptions - A record of selected attribute IDs and their option values.
   * @returns The matched product variant or undefined if no match is found.
   */
  findVariation(variation: Product[], selectedOptions: Record<number, string>): Product | undefined {
    const selectedEntries = Object.entries(selectedOptions);
    if (selectedEntries.length === 0) {
      return undefined;
    }

    return variation.find(variant => {
      return selectedEntries.every(([attrId, optionValue]) => {
        return variant.attributes.some(
          attr => attr.id.toString() === attrId && attr.option === optionValue
        );
      });
    });
  }

  /**
   * Calculates which attribute options are available based on the current selections.
   * @param variants - An array of all possible variation products.
   * @param selectedOptions - A record of the currently selected attribute options.
   * @returns A map where keys are attribute IDs and values are a map of available option names to their full Product variant.
   */
  getAvailableOptions(
    variants: Product[],
    selectedOptions: Record<number, string>
  ): Map<number, Map<string, Product[]>> {
    const available = new Map<number, Map<string, Product[]>>();
    const variationAttributes = this.getProductVariationAttributes();

    variationAttributes.forEach((attribute) => {
      const currentAttributeId = attribute.id.toString();

      // For the current attribute, we want to find variants that match all *other* selections.
      const otherSelectedOptions = Object.entries(selectedOptions).filter(
        ([attrId]) => attrId !== currentAttributeId
      );

      const matchingVariants = variants.filter(variant => {
        return otherSelectedOptions.every(([attrId, optionValue]) => {
          return variant.attributes.some(
            attr => attr.id.toString() === attrId && attr.option === optionValue
          );
        });
      });

      const attributeOptions = new Map<string, Product[]>();
      for (const variant of matchingVariants) {
        for (const variantAttr of variant.attributes) {
          if (variantAttr.id === attribute.id && variantAttr.option) {
            if (!attributeOptions.has(variantAttr.option)) {
              attributeOptions.set(variantAttr.option, []);
            }
            attributeOptions.get(variantAttr.option)?.push(variant);
          }
        }
      }
      available.set(attribute.id, attributeOptions);
    });

    return available;
  }

  toString() {
    return 'Product ' + this.id + ': ' + this.name;
  }
}
