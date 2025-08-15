import { ThemedYStack } from '@/components/ui';
import { NUM_CATEGORY_TILE_COLUMNS, NUM_CATEGORY_TILE_ROWS } from '@/config/app';
import { useProductCategoryContext } from '@/contexts';
import { spacePx } from '@/lib/helpers';
import { JSX, useMemo } from 'react';
import { StackProps, XStack, YStack } from 'tamagui';
import { ProductCategoryTile } from './ProductCategoryTile';

export const MAX_CATEGORIES = NUM_CATEGORY_TILE_COLUMNS * NUM_CATEGORY_TILE_ROWS;


export const ProductCategoryTiles = (props: StackProps): JSX.Element => {
    const { productCategories: rootProductCategories } = useProductCategoryContext();
    const productCategories = useMemo(
        () => rootProductCategories.slice(0, MAX_CATEGORIES),
        [rootProductCategories]
    );
    const GAP = '$2' // your token
    const gapPx = spacePx(GAP);
    const half = Math.round(gapPx / 2)
    const cols = NUM_CATEGORY_TILE_COLUMNS
    const colPct = `${100 / cols}%`

    return (
        <ThemedYStack {...props}>
            <XStack
                fw="wrap"
                m={-half} // cancel outer padding so edges align perfectly

            >
                {productCategories.map((cat) => (
                    <YStack
                        key={cat.id}
                        w={colPct}
                        p={half}
                    // square based on inner content (so padding doesn't distort the square)
                    >
                        <YStack w="100%" aspectRatio={1} br="$2" ov="hidden">
                            <ProductCategoryTile productCategory={cat} />
                        </YStack>
                    </YStack>
                ))}
            </XStack>
        </ThemedYStack>
    );
};
