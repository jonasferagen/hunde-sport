// ProductList.tsx
import { type ListRenderItem as FlashListRenderItem } from "@shopify/flash-list";
import React from "react";

import { ProductCard } from "@/components/features/product/ui/ProductCard";
import { VerticalList } from "@/components/lists/VerticalList";
import { Loader } from "@/components/ui/Loader";
import { ThemedXStack } from "@/components/ui/themed";
import { DefaultTextContent } from "@/components/widgets/DefaultTextContent";
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from "@/config/app";
import { useStableCallback } from "@/hooks/useStableCallback";
import type { PurchasableProduct } from "@/types";
interface ProductListProps {
  products: PurchasableProduct[];
  loadMore: () => void;
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  transitionKey: string | number;
  totalProducts: number;
}

const ITEM_HEIGHT = 170;

export const ProductList = React.memo(function ProductList({
  products,
  isLoading,
  loadMore,
  isLoadingMore,
  hasMore,
}: //totalProducts,
ProductListProps) {
  const keyExtractor = useStableCallback((p: PurchasableProduct) =>
    String(p.id),
  );
  const renderItem: FlashListRenderItem<PurchasableProduct> = useStableCallback(
    ({ item: product, index }) => {
      return (
        <ProductCard
          product={product}
          theme={index % 2 === 0 ? THEME_PRODUCT_ITEM_1 : THEME_PRODUCT_ITEM_2}
        />
      );
    },
  );

  const onEndReached = React.useCallback(() => {
    if (hasMore && !isLoadingMore) loadMore();
  }, [hasMore, isLoadingMore, loadMore]);

  // progress tracking (headless)
  /*

  const { shown, onViewableItemsChanged, viewabilityConfig } =
    useListProgress<PurchasableProduct>(totalProducts);

  // hint control (headless)
  const { hintRef, onAnyScroll } = useIdleHint({
    enabled: hasMore,
    shown,
    autoOnProgressOnly: true, // change to false to kick on every scroll
  }); 

  const onScroll = React.useCallback(
    (_e: any) => {
      onAnyScroll();
    },
    [onAnyScroll],
  );
  */
  return (
    <ThemedXStack f={1} mih={0} pos="relative">
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
          !isLoading ? (
            <DefaultTextContent>Ingen produkter funnet</DefaultTextContent>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        // progress wiring (pure pass-through)
        /*
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
        onScroll={onScroll} */
      />

      {/* overlayed hint  */}
      {/*
      <BottomMoreHint
        ref={hintRef}
        enabled={hasMore}
        shown={Math.min(shown, totalProducts)}
        total={totalProducts}
        idleMs={600}
        offsetRight={12}
        offsetBottom={12}
      /> */}
    </ThemedXStack>
  );
});
