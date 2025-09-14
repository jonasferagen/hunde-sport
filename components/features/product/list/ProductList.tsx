import type { ListRenderItem as FlashListRenderItem } from "@shopify/flash-list";
import React from "react";

import { ProductCard } from "@/components/features/product/ui/ProductCard";
import { VerticalList } from "@/components/lists/VerticalList";
import { Loader } from "@/components/ui/Loader";
import { ThemedXStack } from "@/components/ui/themed";
import { DefaultTextContent } from "@/components/widgets/DefaultTextContent";
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from "@/config/app";
import type { PurchasableProduct } from "@/types";

interface ProductListProps {
  products: PurchasableProduct[];
  loadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
  transitionKey: string | number; // when data identity changes
  totalProducts: number;
}

const ITEM_HEIGHT = 170;

export const ProductList = React.memo(function ProductList({
  products,
  loadMore,
  isLoadingMore,
  hasMore,
  transitionKey,
}: ProductListProps) {
  const keyExtractor = React.useCallback(
    (p: PurchasableProduct) => String(p.id),
    [],
  );

  const onEndReached = React.useCallback(() => {
    if (hasMore && !isLoadingMore) loadMore();
  }, [hasMore, isLoadingMore, loadMore]);

  const renderItem: FlashListRenderItem<PurchasableProduct> = React.useCallback(
    ({ item: product, index }) => (
      <ProductCard
        product={product}
        theme={index % 2 === 0 ? THEME_PRODUCT_ITEM_1 : THEME_PRODUCT_ITEM_2}
      />
    ),
    [],
  );

  return (
    <ThemedXStack f={1} mih={0}>
      <VerticalList<PurchasableProduct>
        data={products}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.8}
        ListFooterComponent={
          isLoadingMore ? <Loader w="100%" h={ITEM_HEIGHT} /> : null
        }
        ListEmptyComponent={
          <DefaultTextContent>Ingen produkter funnet</DefaultTextContent>
        }
        animateFirstTimeKey={transitionKey}
        getStableId={(p) => p.id}
        drawDistance={800}
        showsVerticalScrollIndicator={false}
      />
    </ThemedXStack>
  );
});
