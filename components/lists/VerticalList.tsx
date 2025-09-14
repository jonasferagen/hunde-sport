// components/lists/VerticalList.tsx
import {
  FlashList,
  type FlashListProps,
  type ListRenderItem as FlashListRenderItem,
} from "@shopify/flash-list";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { View } from "tamagui";

type Base<T> = Pick<
  FlashListProps<T>,
  | "onEndReached"
  | "onEndReachedThreshold"
  | "keyExtractor"
  | "drawDistance"
  | "contentContainerStyle"
  | "showsVerticalScrollIndicator"
  | "onScroll"
  | "scrollEventThrottle"
  | "getItemType"
  | "onViewableItemsChanged"
  | "viewabilityConfig"
>;

export interface VerticalListProps<T> extends Base<T> {
  data: readonly T[];
  renderItem: FlashListRenderItem<T>;
  ListFooterComponent?: React.ReactElement | null;
  ListEmptyComponent?: React.ReactElement | null;
  animateFirstTimeKey?: string | number;
  getStableId?: (item: T) => number | string;
  staggerMod?: number; // default 8
}

export function VerticalList<T>({
  data,
  renderItem,
  keyExtractor,
  onEndReached,
  onEndReachedThreshold = 0.8,
  ListFooterComponent,
  ListEmptyComponent,
  drawDistance = 800,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  onScroll,
  scrollEventThrottle = 32,
  getItemType,
  onViewableItemsChanged,
  viewabilityConfig,
  animateFirstTimeKey,
  getStableId,
  staggerMod = 8,
}: VerticalListProps<T>) {
  const animatedIdsRef = React.useRef<Set<string | number>>(new Set());
  React.useEffect(() => {
    animatedIdsRef.current.clear();
  }, [animateFirstTimeKey]);

  const _renderItem: FlashListRenderItem<T> = React.useCallback(
    (info) => {
      const id =
        getStableId?.(info.item) ??
        (keyExtractor ? keyExtractor(info.item, info.index) : info.index);
      const firstTime = !animatedIdsRef.current.has(id);
      if (firstTime) animatedIdsRef.current.add(id);
      const delay = (info.index % (staggerMod || 1)) * 20;

      return (
        <ItemAnimator firstTime={!!firstTime} delay={delay}>
          {renderItem(info)}
        </ItemAnimator>
      );
    },
    [getStableId, keyExtractor, renderItem, staggerMod],
  );

  return (
    <View f={1}>
      <FlashList
        data={data as T[]}
        renderItem={_renderItem}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        ListFooterComponent={ListFooterComponent ?? null}
        ListEmptyComponent={ListEmptyComponent ?? null}
        contentContainerStyle={contentContainerStyle ?? { flexGrow: 1 }}
        drawDistance={drawDistance}
        getItemType={getItemType}
        removeClippedSubviews={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
}

const ItemAnimator: React.FC<{
  firstTime: boolean;
  delay: number;
  children: React.ReactNode;
}> = ({ firstTime, delay, children }) => {
  const opacity = useSharedValue(firstTime ? 0.2 : 1);
  React.useEffect(() => {
    if (!firstTime) return;
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
  }, [firstTime, opacity, delay]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={style}>{children}</Animated.View>;
};
