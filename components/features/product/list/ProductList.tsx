import { FlashList } from "@shopify/flash-list";
import React from "react";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { View } from "tamagui";

import { ProductCard } from "@/components/features/product/display/ProductCard";
import { DefaultTextContent } from "@/components/ui/DefaultTextContent";
import { Loader } from "@/components/ui/Loader";
import { ThemedXStack } from "@/components/ui/themed-components";
import { THEME_PRODUCT_ITEM_1, THEME_PRODUCT_ITEM_2 } from "@/config/app";
import type { PurchasableProduct } from "@/types";

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
  //totalProducts,
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

  /*
  const {
    state: vis,
    onViewableItemsChanged,
    viewabilityConfig,
  } = useVisibleItems();
  //const hintRef = React.useRef<BottomMoreHintHandle>(null);
//  const enabled = products.length < totalProducts;
//  const shown = Math.min(vis.last >= 0 ? vis.last + 1 : 0, totalProducts);
*/
  /*
  const onScroll = React.useCallback(() => {
    hintRef.current?.kick();
  }, []);
  */
  const renderItem = React.useCallback(
    ({ item: product, index }: { item: PurchasableProduct; index: number }) => {
      const firstTime = !animatedIdsRef.current.has(product.id);
      if (firstTime) animatedIdsRef.current.add(product.id);

      return (
        <ItemAnimator product={product} index={index} firstTime={firstTime} />
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
          //  onViewableItemsChanged={onViewableItemsChanged}
          //  viewabilityConfig={viewabilityConfig}
          // onScroll={onScroll}
          scrollEventThrottle={32}
          showsVerticalScrollIndicator={false}
        />
      </ThemedXStack>
    </View>
  );
});

/* 
        <BottomMoreHint
          ref={hintRef}
          enabled={enabled}
          shown={shown}
          total={totalProducts}
        /> */

type ItemAnimatorProps = {
  product: PurchasableProduct;
  index: number;
  firstTime: boolean;
};

function ItemAnimator({ product, index, firstTime }: ItemAnimatorProps) {
  // Safeguard opacity lives on the *inner* wrapper
  const opacityValue = useSharedValue(firstTime ? 0.01 : 1);

  React.useEffect(() => {
    if (!firstTime) return;

    const timer = setTimeout(() => {
      // only nudge to 1 if we somehow didn't get there
      if (opacityValue.value < 1) {
        opacityValue.value = withTiming(1, { duration: 200 });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [firstTime, opacityValue]);

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  const delay = (index % 8) * 20;

  return (
    // Outer handles FadeIn (defaults). It can animate opacity+transform.
    // Inner controls its own opacity for the safeguard; no conflict because different nodes.
    <Animated.View
      entering={firstTime ? FadeIn.delay(delay) : undefined}
      collapsable={false}
    >
      <Animated.View style={opacityStyle}>
        <ProductCard
          product={product}
          theme={index % 2 === 0 ? THEME_PRODUCT_ITEM_1 : THEME_PRODUCT_ITEM_2}
        />
      </Animated.View>
    </Animated.View>
  );
}
