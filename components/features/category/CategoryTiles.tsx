import { CategoryTile } from '@/components/features/category/CategoryTile';
import { GridTiles } from '@/components/ui/tile/GridTiles';
import { InfiniteListQueryResult } from '@/hooks/data/util';
import { Category } from '@/models/Category';
import { ThemeVariant } from '@/types';
import React, { JSX } from 'react';
import { XStack } from 'tamagui';

interface CategoryTilesProps {
    queryResult: InfiniteListQueryResult<Category>;
    theme?: ThemeVariant;
}

export const CategoryTiles = ({ queryResult, theme = 'primary' }: CategoryTilesProps): JSX.Element => {
    return (
        <GridTiles
            queryResult={queryResult}
            renderItem={({ item }) => (
                <XStack flexShrink={0} aspectRatio={1} padding="$2">
                    <CategoryTile
                        category={item}
                        theme={theme}
                    />
                </XStack>

            )}
        />
    );
};
