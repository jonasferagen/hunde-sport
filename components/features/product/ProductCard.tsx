import { ProductTile } from "@/components/ui/";
import { routes } from '@/config/routes';
import { Product } from "@/types";
import React from 'react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {

    const handlePress = () => {
        routes.product(product);
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