import { ProductTile } from "@/components/ui/";
import { routes } from '@/config/routes';
import { CARD_DIMENSIONS } from '@/styles/Dimensions';
import { Product } from "@/types";
import { Link } from 'expo-router';
import React from 'react';
import { DimensionValue } from 'react-native';

interface ProductCardProps {
    product: Product;
    width?: DimensionValue;
    height?: DimensionValue;
    mainColor?: string;
}

export const ProductCard = ({
    product,
    width = CARD_DIMENSIONS.product.width,
    height = CARD_DIMENSIONS.product.height,
    mainColor = '#777'
}: ProductCardProps) => {

    return (
        <Link href={routes.product(product)} asChild>
            <ProductTile
                product={product}
                width={width}
                height={height}
                mainColor={mainColor}
            />
        </Link>
    );
};