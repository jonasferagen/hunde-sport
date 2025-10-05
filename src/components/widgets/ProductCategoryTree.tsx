// ProductCategoryTree.tsx
import { ChevronDown } from "@tamagui/lucide-icons";
import React, { type ComponentRef, memo } from "react";
import { View } from "react-native";
import type { AnimatedRef } from "react-native-reanimated";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getTokenValue, useEvent } from "tamagui";
import { create } from "zustand";

import {
  ThemedButton,
  ThemedText,
  ThemedXStack,
  ThemedYStack,
} from "@/components/ui/themed";
import { EdgeFadesOverlay } from "@/components/widgets/EdgeFadesOverlay";
import { useEdgeFades } from "@/hooks/ui/useEdgeFades";
import { useCanonicalNavigation } from "@/hooks/useCanonicalNavigation";
import {
  useProductCategories,
  useProductCategory,
} from "@/stores/productCategoryStore";
import type { ProductCategory } from "@/types";

// Instance type for Animated.ScrollView
type AnimatedScrollViewRef = ComponentRef<typeof Animated.ScrollView>;

type TreeCtxValue = {
  scrollRef: AnimatedRef<AnimatedScrollViewRef>;
  lastYRef: { current: number };
  viewportYRef: { current: number };
  viewportHRef: { current: number };
};
const TreeCtx = React.createContext<TreeCtxValue | null>(null);
const contentContainerStyle = { paddingBottom: 12 };
const parentPathIds: number[] = [];
export const ProductCategoryTree = ({
  colors,
}: {
  colors: [string, string];
}) => {
  // Single entry: start at root (id=0)
  const scrollRef = useAnimatedRef<AnimatedScrollViewRef>();
  const lastYRef = React.useRef(0);
  const viewportYRef = React.useRef(0);
  const viewportHRef = React.useRef(0);

  const ctx = React.useMemo(
    () => ({ scrollRef, lastYRef, viewportYRef, viewportHRef }),
    [scrollRef],
  );
  const { atStart, atEnd, onLayout, onContentSizeChange, onScroll } =
    useEdgeFades("vertical");

  return (
    <TreeCtx.Provider value={ctx}>
      <ThemedYStack f={1} mih={0} onLayout={onLayout}>
        <Animated.ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={useEvent((w, h) => onContentSizeChange(w, h))}
          contentContainerStyle={contentContainerStyle}
        >
          <ThemedYStack container>
            {/* Render from the dummy root downwards */}
            <ProductCategoryBranch
              id={0}
              level={0}
              parentPathIds={parentPathIds}
            />
          </ThemedYStack>
        </Animated.ScrollView>
        <EdgeFadesOverlay
          orientation="vertical"
          heightToken="$2" // tweak (e.g. $3–$6)
          visibleStart={atStart} // show top fade when NOT at top
          visibleEnd={atEnd} // show bottom fade when NOT at bottom
          bgStart={colors[0]}
          bgEnd={colors[1]}
        />
      </ThemedYStack>
    </TreeCtx.Provider>
  );
};

const fullWidth = { flex: 1 };
type ProductCategoryBranchProps = {
  id: number;
  level: number;
  /** The accumulated path up to (but not including) this id */
  parentPathIds: readonly number[];
};

const ProductCategoryBranch = memo(function ProductCategoryBranch({
  id,
  level,
  parentPathIds,
}: ProductCategoryBranchProps) {
  // build this node's full path once per id/parentPathIds
  const pathIds = React.useMemo(
    () => [...parentPathIds, id],
    [parentPathIds, id],
  );

  const node = useProductCategory(id);
  const childCategories = useProductCategories(id);
  const hasChildren = childCategories.length > 0;
  const isExpanded = useIsExpanded(id);

  return (
    <Animated.View layout={LinearTransition.duration(150)} collapsable={false}>
      <ThemedYStack>
        {node.id > 0 && (
          <ThemedXStack>
            <ProductCategoryTreeItem
              productCategory={node}
              level={level}
              isExpanded={isExpanded}
              hasChildren={hasChildren}
              pathIds={pathIds}
            />
          </ThemedXStack>
        )}

        {isExpanded && hasChildren && (
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(120)}
            collapsable={false}
            style={fullWidth}
          >
            <ThemedYStack>
              {childCategories.map((c) => (
                <ProductCategoryBranch
                  key={c.id}
                  id={c.id}
                  level={level + 1}
                  parentPathIds={pathIds} // <- no inline array; stable prop
                />
              ))}
            </ThemedYStack>
          </Animated.View>
        )}
      </ThemedYStack>
    </Animated.View>
  );
});

interface RenderItemProps {
  productCategory: ProductCategory;
  isExpanded: boolean;
  level: number;
  hasChildren: boolean;
  pathIds: number[];
}

const ProductCategoryTreeItem = memo(function ProductCategoryTreeItem({
  productCategory,
  isExpanded,
  level,
  hasChildren,
  pathIds,
}: RenderItemProps) {
  const setActivePathIds = useSetActivePathIds();
  const INDENT = React.useMemo(() => getTokenValue("$6", "space"), []);
  const rowRef = React.useRef<View>(null);

  const onToggleExpandPath = React.useCallback(() => {
    if (!hasChildren) return;
    // If currently expanded, collapse to parent path; else set this node's path.
    const nextPathIds = isExpanded ? pathIds.slice(0, -1) : pathIds;
    //  ensureRoomBelow();
    setActivePathIds(nextPathIds);
  }, [hasChildren, isExpanded, pathIds, setActivePathIds]);

  const { to } = useCanonicalNavigation();
  const onPress = useEvent(() => to("product-category", productCategory));

  return (
    <ThemedXStack ref={rowRef} w="100%" ai="center" gap="$2" mb="$2">
      <ThemedXStack ml={(level - 1) * INDENT} f={1}>
        <ThemedButton theme="shade" f={1} onPress={onPress}>
          <ThemedXStack f={1} split>
            <ThemedText f={1} letterSpacing={0.5}>
              {productCategory.name}
            </ThemedText>
            <ThemedText tabular>({productCategory.count})</ThemedText>
          </ThemedXStack>
        </ThemedButton>
      </ThemedXStack>

      <ThemedButton
        fs={1}
        theme="shade"
        circular
        onPress={onToggleExpandPath}
        disabled={!hasChildren}
        opacity={hasChildren ? 1 : 0}
        pointerEvents={hasChildren ? "auto" : "none"}
      >
        {hasChildren && <AnimatedListExpansionIcon expanded={isExpanded} />}
      </ThemedButton>
    </ThemedXStack>
  );
});

const AnimatedListExpansionIcon = ({ expanded }: { expanded: boolean }) => {
  const rotation = useSharedValue(expanded ? 0 : -90);
  React.useEffect(() => {
    rotation.value = withTiming(expanded ? 0 : -90, { duration: 150 });
  }, [expanded, rotation]);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));
  return (
    <Animated.View style={animatedStyle}>
      <ChevronDown />
    </Animated.View>
  );
};
type CategoryTreeUI = {
  /** e.g. [0, 10, 42] = root -> top-level 10 -> child 42 */
  activePathIds: number[];
  setActivePathIds: (activePathIds: number[]) => void;
  isExpanded: (productCategoryId: number) => boolean;
};

const useCategoryTreeStore = create<CategoryTreeUI>((set, get) => ({
  activePathIds: [0], // root open by default
  setActivePathIds: (activePathIds) => set({ activePathIds }),
  isExpanded: (productCategoryId) =>
    get().activePathIds.includes(productCategoryId),
}));

const useIsExpanded = (productCategoryId: number) =>
  useCategoryTreeStore((s) => s.isExpanded(productCategoryId));

const useSetActivePathIds = () =>
  useCategoryTreeStore((s) => s.setActivePathIds);
