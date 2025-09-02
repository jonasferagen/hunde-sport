import { FlashList } from "@shopify/flash-list";
import React from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { View } from "tamagui";

import { ThemedXStack } from "@/components/ui";
import { DefaultTextContent } from "@/components/ui/DefaultTextContent";
import { Loader } from "@/components/ui/Loader";
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from "@/config/app";
import { useVisibleItems } from "@/hooks/ui/useVisibleItems";
import type { PurchasableProduct } from "@/types";

import { ProductCard } from "@/components/features/product/display/ProductCard";
import { BottomMoreHint, type BottomMoreHintHandle } from "./BottomMoreHint";
// inside ProductList:

interface ProductListProps {
  products: PurchasableProduct[];
  loadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
  /** Changes when the data identity changes (e.g. category id or search query) */
  transitionKey: string | number;
  totalProducts: number;
}

const ITEM_HEIGHT = 170;

export const ProductList = React.memo(function ProductList({
  products,
  loadMore,
  isLoadingMore,
  hasMore,
  transitionKey,
  totalProducts,
}: ProductListProps) {
  const keyExtractor = React.useCallback(
    (p: PurchasableProduct) => String(p.id),
    []
  );

  const animatedIdsRef = React.useRef<Set<number>>(new Set());
  React.useEffect(() => {
    // new search/category -> allow items to animate once
    animatedIdsRef.current.clear();
  }, [transitionKey]);

  const onEndReached = React.useCallback(() => {
    if (hasMore && !isLoadingMore) loadMore();
  }, [hasMore, isLoadingMore, loadMore]);

  const {
    state: vis,
    onViewableItemsChanged,
    viewabilityConfig,
  } = useVisibleItems();
  const hintRef = React.useRef<BottomMoreHintHandle>(null);
  const enabled = products.length < totalProducts;
  const shown = Math.min(vis.last >= 0 ? vis.last + 1 : 0, totalProducts);

  const onScroll = React.useCallback(() => {
    hintRef.current?.kick();
  }, []);
  const renderItem = React.useCallback(
    ({ item: product, index }: { item: PurchasableProduct; index: number }) => {
      const firstTime = !animatedIdsRef.current.has(product.id);
      if (firstTime) animatedIdsRef.current.add(product.id);

      const delay = (index % 8) * 20;

      return (
        <Animated.View
          // FlashList owns keys via keyExtractor — don’t add a key here
          entering={firstTime ? FadeIn.delay(delay) : undefined}
        >
          <ProductCard
            product={product}
            theme={
              index % 2 === 0 ? THEME_PRODUCT_ITEM_1 : THEME_PRODUCT_ITEM_2
            }
          />
        </Animated.View>
      );
    },
    []
  );

  return (
    <View f={1}>
      <ThemedXStack f={1} mih={0}>
        <FlashList
          data={products as PurchasableProduct[]}
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
          contentContainerStyle={{ flexGrow: 1 }}
          drawDistance={800}
          getItemType={() => "product"}
          removeClippedSubviews={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={onScroll}
          scrollEventThrottle={32}
          showsVerticalScrollIndicator={false}
        />
        <BottomMoreHint
          ref={hintRef}
          enabled={enabled}
          shown={shown}
          total={totalProducts}
        />
      </ThemedXStack>
    </View>
  );
});
