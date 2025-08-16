import { BaseProduct, BaseProductData } from './BaseProduct';
import { ProductAttribute } from './ProductAttribute';

export type Product = SimpleProduct | VariableProduct | ProductVariation;
export type PurchasableProduct = SimpleProduct | VariableProduct;


/**
 * Factory function to create a product instance from raw data.
 * This ensures that we are working with class instances with methods,
 * not just plain data objects.
 * @param data The raw product data from the API.
 * @returns An instance of SimpleProduct, VariableProduct, or ProductVariation.
 */
export const mapToProduct = (data: any) => {
    const productData: BaseProductData = {
        id: data.id,
        name: data.name,
        permalink: data.permalink,
        slug: data.slug,
        description: data.description,
        short_description: data.short_description || '',
        images: data.images || [],
        prices: data.prices,
        on_sale: data.on_sale,
        featured: data.featured || false,
        is_in_stock: data.is_in_stock,
        is_purchasable: data.is_purchasable,
        is_on_backorder: data.is_on_backorder,
        parent: data.parent,
        categories: data.categories || [],
        attributes: data.attributes || [],
        variations: data.variations || [],
        variation: data.variation || '',
        type: data.type,
    };

    if (data.type === 'variable') {
        return new VariableProduct(productData);
    }

    if (data.type === 'variation') {
        return new ProductVariation(productData);
    }

    // All other types are treated as SimpleProduct
    return new SimpleProduct(productData);
};


export class ProductVariation extends BaseProduct<BaseProductData> {
    readonly type: 'variation' = 'variation';
    constructor(data: BaseProductData) {
        if (data.type !== 'variation') {
            throw new Error('Cannot construct ProductVariation with type other than "variation".');
        }
        super(data);
    }

    getParsedVariation(): { name: string; value: string }[] {
        if (!this.variation) {
            return [];
        }

        return this.variation
            .split(',')
            .map((pair) => {
                const [attribute, value] = pair.split(':');
                if (!attribute || !value) {
                    return null;
                }
                return {
                    name: attribute.trim(),
                    value: value.trim(),
                };
            })
            .filter((v): v is { name: string; value: string } => v !== null);
    }
    getLabel(): string {
        return this.getParsedVariation().map((v) => v.value).join(', ');
    }
}

export class SimpleProduct extends BaseProduct<BaseProductData> {
    readonly type: 'simple' = 'simple';
    constructor(data: BaseProductData) {
        if (data.type !== 'simple') {
            throw new Error('Cannot construct SimpleProduct with type other than "simple".');
        }
        super(data);
    }
}

export class VariableProduct extends BaseProduct<BaseProductData> {
    readonly type: 'variable' = 'variable';

    constructor(data: BaseProductData) {
        if (data.type !== 'variable') {
            throw new Error('Invalid data type for VariableProduct');
        }
        super(data);
    }

    getAttributesForVariationSelection(): ProductAttribute[] {
        return this.attributes.filter((attribute) => attribute.has_variations);
    }
}
