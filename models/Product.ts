import { Category, CategoryData } from './Category';
import { Image } from './Image';
import { ProductAttribute, ProductAttributeData } from './ProductAttribute';

export type ProductType = 'simple' | 'variable' | 'variant';

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

  getVariationAttributes(): ProductAttribute[] {
    return this.attributes.filter(attr => attr.variation);
  }

  /**
   * Finds a matching variant from a list of products based on selected options.
   * @param variants - An array of variation products to search through.
   * @param selectedOptions - A record of selected attribute IDs and their option values.
   * @returns The matched product variant or undefined if no match is found.
   */
  findVariant(variants: Product[], selectedOptions: Record<number, string>): Product | undefined {
    const selectedKeys = Object.keys(selectedOptions);
    if (selectedKeys.length === 0) return undefined;

    // Get the available options based on the current selections.
    const availableOptions = this.getAvailableOptions(variants, selectedOptions);

    // Find the first attribute that has a selection and is available.
    const firstSelectedAttrId = selectedKeys.map(Number)[0];
    const selectedOption = selectedOptions[firstSelectedAttrId];

    // Retrieve the variant from the new map structure.
    const variant = availableOptions.get(firstSelectedAttrId)?.get(selectedOption);

    if (variant) {
      // Final check to ensure the retrieved variant matches all selected options.
      const allOptionsMatch = selectedKeys.every(key => {
        const attributeId = Number(key);
        const option = selectedOptions[attributeId];
        return variant.attributes.some(attr => attr.id === attributeId && attr.option === option);
      });

      if (allOptionsMatch) {
        return variant;
      }
    }

    return undefined;
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
  ): Map<number, Map<string, Product>> {
    const available = new Map<number, Map<string, Product>>();
    const variationAttributes = this.getVariationAttributes();

    variationAttributes.forEach((attr) => {
      available.set(attr.id, new Map<string, Product>());
    });

    for (const variant of variants) {
      for (const variantAttr of variant.attributes) {
        if (!variantAttr.option) continue;

        let isMatch = true;
        // Check if this variant is compatible with all *other* selected options.
        for (const selectedAttrId in selectedOptions) {
          if (Number(selectedAttrId) === variantAttr.id) continue; // Skip self

          const selectedOption = selectedOptions[selectedAttrId];
          const variantHasSelectedOption = variant.attributes.find(
            (a) => a.id === Number(selectedAttrId) && a.option === selectedOption
          );

          if (!variantHasSelectedOption) {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          available.get(variantAttr.id)?.set(variantAttr.option, variant);
        }
      }
    }
    return available;
  }

  toString() {
    return 'Product ' + this.id + ': ' + this.name;
  }
}
