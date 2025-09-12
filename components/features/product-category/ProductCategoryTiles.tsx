import React from "react";
import { type StackProps, XStack, YStack } from "tamagui";

import { ThemedYStack } from "@/components/ui/themed-components";
import { TileSquare } from "@/components/ui/tile/TileSquare";
import { NUM_CATEGORY_TILE_COLUMNS } from "@/config/app";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import { spacePx } from "@/lib/theme";
import { useProductCategories } from "@/stores/productCategoryStore";

export const ProductCategoryTiles = React.memo(function ProductCategoryTiles(
  props: StackProps
) {
  const productCategories = useProductCategories(0);

  const GAP = "$3";
  const gapPx = spacePx(GAP);
  const half = Math.round(gapPx / 2);
  const cols = NUM_CATEGORY_TILE_COLUMNS;
  const colPct = `${100 / cols}%`;
  const { to } = useCanonicalNavigation();

  return (
    <ThemedYStack {...props} mx={gapPx}>
      <XStack fw="wrap" m={-half}>
        {productCategories.map((cat, _index) => (
          <YStack key={cat.id} w={colPct} p={half}>
            {/* Square here; remove aspectRatio on Tile */}
            <YStack w="100%" aspectRatio={1} br="$2">
              <TileSquare
                title={cat.name}
                image={cat.image}
                approxW={Math.round(160 / NUM_CATEGORY_TILE_COLUMNS)} // if you have it
                onPress={() => to("product-category", cat)}
              />
            </YStack>
          </YStack>
        ))}
      </XStack>
    </ThemedYStack>
  );
});
