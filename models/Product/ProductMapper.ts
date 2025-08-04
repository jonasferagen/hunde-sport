import { ProductData } from './Product';
import { ProductVariation } from './ProductVariation';
import { SimpleProduct } from './SimpleProduct';
import { VariableProduct } from './VariableProduct';

export const mapToProduct = (item: any): SimpleProduct | VariableProduct | ProductVariation => {

    try {

        const productData: ProductData = {
            id: item.id,
            name: item.name,
            permalink: item.permalink,
            slug: item.slug,
            on_sale: item.on_sale,
            featured: item.featured || false,
            description: item.description,
            short_description: item.short_description || '',
            price_html: item.price_html,
            prices: item.prices,
            images: item.images || [],
            categories: item.categories || [],
            tags: item.tags || [],
            attributes: (item.attributes || []).map((attr: any) => ({
                id: attr.id,
                name: attr.name,
                taxonomy: attr.taxonomy,
                has_variations: attr.has_variations,
                terms: attr.terms || [],
                variation: attr.has_variations || false,
            })),
            variations: item.variations || [],
            parent_id: item.parent_id || 0,
            type: item.type,
            is_in_stock: item.is_in_stock,
            is_purchasable: item.is_purchasable,
            has_options: item.has_options,
            related_ids: item.related_ids || [],
        };

        switch (productData.type) {
            case 'simple':
                return new SimpleProduct(productData);
            case 'variable':
                return new VariableProduct(productData);
            case 'variation':
                return new ProductVariation(productData);
            default:
                throw new Error(`Unknown product type: ${productData.type}`);
        }

    } catch (error) {
        console.error("Failed to map product:", item, error);
        throw error; // re-throw the error to be handled by the caller
    }
};