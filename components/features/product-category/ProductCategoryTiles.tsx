import { ThemedYStack } from '@/components/ui';
import { TileSquare } from '@/components/ui/tile/TileSquare';
import { NUM_CATEGORY_TILE_COLUMNS, NUM_CATEGORY_TILE_ROWS } from '@/config/app';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { spacePx } from '@/lib/helpers';
import { useProductCategoryStore } from '@/stores/productCategoryStore';
import React, { JSX, useMemo } from 'react';
import { StackProps, XStack, YStack } from 'tamagui';
export const MAX_CATEGORIES = NUM_CATEGORY_TILE_COLUMNS * NUM_CATEGORY_TILE_ROWS;


export const ProductCategoryTiles = React.memo((props: StackProps): JSX.Element => {

    const roots = useProductCategoryStore((s) => s.productCategories); // see store note below
    const productCategories = useMemo(
        () => roots.filter((c) => c.parent === 0).slice(0, MAX_CATEGORIES),
        [roots]
    );

    const GAP = '$3';
    const gapPx = spacePx(GAP);
    const half = Math.round(gapPx / 2);
    const cols = NUM_CATEGORY_TILE_COLUMNS;
    const colPct = `${100 / cols}%`;

    const { to } = useCanonicalNav();


    return (
        <ThemedYStack {...props} mx={gapPx}>
            <XStack fw="wrap" m={-half}>
                {productCategories.map((cat) => (
                    <YStack key={cat.id} w={colPct} p={half}>
                        {/* Square here; remove aspectRatio on Tile */}
                        <YStack w="100%" aspectRatio={1} br="$2">
                            <TileSquare
                                title={cat.name}
                                image={cat.image}
                                approxW={Math.round(160 / NUM_CATEGORY_TILE_COLUMNS)} // if you have it
                                onPress={() => to('product-category', cat)}
                            />
                        </YStack>
                    </YStack>
                ))}
            </XStack>
        </ThemedYStack>
    );
});

