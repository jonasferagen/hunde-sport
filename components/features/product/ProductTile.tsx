import { BaseTile } from "@/components/ui/tile/BaseTile";
import { routes } from '@/config/routes';
import { CARD_DIMENSIONS } from '@/styles/Dimensions';
import { Product } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { Link } from 'expo-router';
import React from 'react';
import { DimensionValue } from 'react-native';

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
    const { images, name, price } = product;
    const image = images[0];
    return (
        <Link href={routes.product(product)} asChild>
            <BaseTile

                width={width}
                height={height}
                themeVariant={themeVariant}
                name={name}
                imageUrl={image.src}
                topRightText={formatPrice(price)}
                nameNumberOfLines={2}
                gradientMinHeight={40}

            />
        </Link>
    );
};