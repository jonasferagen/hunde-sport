import React from "react";
import type { StackProps } from "tamagui";

import { GridTiles } from "@/components/ui/tiles/layout/GridTiles";
import { SquareTile } from "@/components/ui/tiles/SquareTile";
import { NUM_CATEGORY_TILE_COLUMNS } from "@/config/app";
import type { ProductCategory } from "@/domain/ProductCategory";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import { useProductCategories } from "@/stores/productCategoryStore";

export const ProductCategoryTiles = React.memo(function ProductCategoryTiles(
  props: StackProps,
) {
  const productCategories = useProductCategories(0);
  const { to } = useCanonicalNavigation();
  const approxW = Math.round(160 / NUM_CATEGORY_TILE_COLUMNS);

  return (
    <GridTiles
      {...props}
      items={productCategories}
      columns={NUM_CATEGORY_TILE_COLUMNS}
      square
      keyExtractor={(productCategory: ProductCategory) =>
        String(productCategory.id)
      }
      renderItem={({ item }) => (
        <SquareTile
          title={item.name}
          image={item.image}
          approxW={approxW}
          onPress={() => to("product-category", item)}
        />
      )}
    />
  );
});
