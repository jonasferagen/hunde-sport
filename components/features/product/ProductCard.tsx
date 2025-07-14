import { ProductTile } from "@/components/ui/";
import { useBreadcrumbs } from "@/hooks/Breadcrumbs/BreadcrumbContext";
import { routes } from '@/lib/routing';
import { Product } from "@/types";
import React from 'react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const { buildTrail } = useBreadcrumbs();

    const handlePress = () => {
        if (product.categories.length > 0) {
            buildTrail(product.categories[0].id);
        }
        routes.product(product.id.toString(), product.name);
    };

    return (
        <ProductTile
            product={product}
            width={200}
            height={150}
            mainColor={'#777'}
            onPress={handlePress}
        />
    );
};