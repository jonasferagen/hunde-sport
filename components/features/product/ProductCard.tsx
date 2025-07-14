import { ProductTile } from "@/components/ui/";
import { useBreadcrumbs } from "@/hooks/Breadcrumbs/BreadcrumbContext";
import { Product } from "@/types";
import { router } from "expo-router";
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
        router.push(`/product?id=${product.id}&name=${product.name}`);
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