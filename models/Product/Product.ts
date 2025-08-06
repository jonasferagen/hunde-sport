import { BaseProductData } from './BaseProduct';
import { ProductVariation, ProductVariationData } from "./ProductVariation";
import { SimpleProduct, SimpleProductData } from "./SimpleProduct";
import { VariableProduct, VariableProductData } from "./VariableProduct";

export type Product = SimpleProduct | VariableProduct | ProductVariation;

export type PurchasableProduct = SimpleProduct | VariableProduct;



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
    is_on_backorder: item.is_on_backorder,
    parent: item.parent,
    categories: item.categories || [],
    type: item.type,
    attributes: item.attributes || [],
    variations: item.variations || [],
});

/**
 * Factory function to create a product instance from raw data.
 * This ensures that we are working with class instances with methods,
 * not just plain data objects.
 * @param data The raw product data from the API.
 * @returns An instance of SimpleProduct, VariableProduct, or ProductVariation.
 */
export const mapToProduct = (data: any) => {
    if (data.type === 'variable') {
        const variableProductData: VariableProductData = {
            ...mapData(data),
        };
        return new VariableProduct(variableProductData);
    }

    if (data.type === 'variation') {
        const variationData: ProductVariationData = {
            ...mapData(data),
            type: 'variation',
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
