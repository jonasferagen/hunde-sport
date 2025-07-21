import { BaseTile } from "@/components/ui/tile/BaseTile";
import { routes } from '@/config/routes';
import { useThemeContext } from "@/contexts";
import { CARD_DIMENSIONS, SPACING } from '@/styles';
import { Product } from "@/types";
import { Link } from 'expo-router';
import React from 'react';
import { DimensionValue, StyleSheet, View } from 'react-native';
import { PriceTag } from './display/PriceTag';

interface ProductTileProps {
    product: Product;
    width?: DimensionValue;
    height?: DimensionValue;
    themeVariant?: any;
}

export const ProductTile = ({
    product,
    width = CARD_DIMENSIONS.product.width,
    height = CARD_DIMENSIONS.product.height,
    themeVariant = 'primary'
}: ProductTileProps) => {
    const { images, name } = product;
    const image = images[0];
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant(themeVariant);
    const styles = createStyles(theme);

    const PriceComponent = (
        <View style={styles.priceContainer}>
            <PriceTag product={product} />
        </View>
    );

    return (
        <Link href={routes.product(product)} asChild>
            <BaseTile
                width={width}
                height={height}
                themeVariant={themeVariant}
                name={name}
                imageUrl={image.src}
                topRightComponent={PriceComponent}
                nameNumberOfLines={2}
                gradientMinHeight={40}
            />
        </Link>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    priceContainer: {
        backgroundColor: theme.backgroundColor,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: SPACING.sm,
    },
});