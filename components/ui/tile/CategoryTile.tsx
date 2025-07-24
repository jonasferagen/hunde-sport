import { Tile } from "@/components/ui/tile/Tile";
import { routes } from '@/config/routes';
import { Category } from '@/models/Category';
import { CARD_DIMENSIONS } from '@/styles';
import { ThemeVariant } from '@/types';
import React from 'react';
import { DimensionValue, StyleProp, ViewStyle } from 'react-native';

interface CategoryTileProps {
    category: Category;
    width?: DimensionValue;
    height?: DimensionValue;
    themeVariant?: ThemeVariant;
    style?: StyleProp<ViewStyle>;
}
export const CategoryTile = ({
    category,
    width = CARD_DIMENSIONS.category.width,
    height = CARD_DIMENSIONS.category.height,
    themeVariant,
    style,
    ...props
}: CategoryTileProps) => {


    const finalHref = routes.category(category);

    return (

        <Tile
            title={category.name}
            themeVariant={themeVariant ?? 'primary'}
            imageUrl={category.image?.src}
            href={finalHref}
            style={style}
            {...props}

        >
            <></>
        </Tile>

    );
};
