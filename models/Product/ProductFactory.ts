import { BaseProductData } from './BaseProduct';
import { ProductAttribute } from './ProductAttribute';
import { ProductVariation, ProductVariationData } from './ProductVariation';
import { SimpleProduct, SimpleProductData } from './SimpleProduct';
import { VariableProduct, VariableProductData } from './VariableProduct';

const mapData = (item: any): BaseProductData => ({
    id: item.id,
    name: item.name,
    permalink: item.permalink,
    slug: item.slug,
    description: item.description,
    short_description: item.short_description || '',
    images: item.images || [],
    prices: item.prices,
    on_sale: item.on_sale,
    featured: item.featured || false,
    is_in_stock: item.is_in_stock,
    is_purchasable: item.is_purchasable,
    categories: item.categories || [],
    tags: item.tags || [],
    type: item.type,
    related_ids: item.related_ids || [],
});

/**
 * Factory function to create a product instance from raw data.
 * This ensures that we are working with class instances with methods,
 * not just plain data objects.
 * @param data The raw product data from the API.
 * @returns An instance of SimpleProduct, VariableProduct, or ProductVariation.
 */
export const createProduct = (data: any) => {
    if (data.type === 'variable') {
        const variableProductData: VariableProductData = {
            ...mapData(data),
            attributes: (data.attributes || []).map((attr: ProductAttribute) => ({
                id: attr.id,
                name: attr.name,
                taxonomy: attr.taxonomy,
                has_variations: attr.has_variations,
                terms: attr.terms || [],
                variation: attr.has_variations || false,
            })),
            variations: data.variations || [],
            type: 'variable',
        };
        return new VariableProduct(variableProductData);
    }

    if (data.type === 'variation') {
        const variationData: ProductVariationData = {
            ...mapData(data),
            type: 'variation',
            attributes: data.attributes || [],
        };
        return new ProductVariation(variationData);
    }

    // All other types are treated as SimpleProduct
    const simpleProductData: SimpleProductData = {
        ...mapData(data),
        type: 'simple',
    };
    return new SimpleProduct(simpleProductData);
};
