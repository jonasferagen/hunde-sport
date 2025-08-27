import { BaseProductData } from './BaseProduct';
import { ProductVariation } from './ProductVariation';
import { SimpleProduct } from './SimpleProduct';
import { VariableProduct } from './VariableProduct';
; (global as any).navigator = { product: 'node' };

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
        _variations: data.variations || [],
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



