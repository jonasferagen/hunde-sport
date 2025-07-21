import { BaseTile } from "@/components/ui/tile/BaseTile";
import { routes } from '@/config/routes';
import { CARD_DIMENSIONS } from '@/styles/Dimensions';
import { Product } from "@/types";
import { Link } from 'expo-router';
import React from 'react';
import { DimensionValue } from 'react-native';
import { PriceInfo } from './price/PriceInfo';

interface ProductTileProps {
    product: Product;
    width?: DimensionValue;
    height?: DimensionValue;
    themeVariant?: string;
}

export const ProductTile = ({
    product,
    width = CARD_DIMENSIONS.product.width,
    height = CARD_DIMENSIONS.product.height,
    themeVariant = 'primary'
}: ProductTileProps) => {
    const { images, name } = product;
    const image = images[0];
    return (
        <Link href={routes.product(product)} asChild>
            <BaseTile

                width={width}
                height={height}
                themeVariant={themeVariant}
                name={name}
                imageUrl={image.src}
                topRightComponent={<PriceInfo product={product} />}
                nameNumberOfLines={2}
                gradientMinHeight={40}

            />
        </Link>
    );
};