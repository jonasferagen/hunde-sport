// ProductCategoryTree.tsx
import { useCanonicalNavigation } from '@/hooks/useCanonicalNavigation';
import { useCategoryById, useVisibleChildren } from '@/stores/productCategoryStore';
import { ChevronDown } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React, { JSX, memo, type ComponentRef } from 'react';
import { UIManager, findNodeHandle, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import type { AnimatedRef } from 'react-native-reanimated';
import { default as Animated, default as AnimatedR, FadeIn, FadeOut, LinearTransition, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getTokenValue } from 'tamagui';
import { ThemedXStack, ThemedYStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedText } from '../ui/themed-components/ThemedText';
import { useIsExpanded, useToggleExpanded } from './ProductCategoryTreeStore';

// Instance type for Animated.ScrollView
type AnimatedScrollViewRef = ComponentRef<typeof Animated.ScrollView>;

type TreeCtxValue = {
    scrollRef: AnimatedRef<AnimatedScrollViewRef>; // instance ref
    lastYRef: { current: number };
    viewportYRef: { current: number };
    viewportHRef: { current: number };
};
const TreeCtx = React.createContext<TreeCtxValue | null>(null);

export const ProductCategoryTree = memo(({ level = 0 }: { level?: number }) => {
    const root = useVisibleChildren(0);

    const scrollRef = useAnimatedRef<AnimatedScrollViewRef>(); // instance
    const lastYRef = React.useRef(0);

    // viewport of THIS tree (not full screen)
    const viewportYRef = React.useRef(0);
    const viewportHRef = React.useRef(0);

    const onScroll = React.useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
        lastYRef.current = e.nativeEvent.contentOffset.y;
    }, []);

    const onLayout = React.useCallback((e: NativeSyntheticEvent<any>) => {
        const { y, height } = e.nativeEvent.layout;
        viewportYRef.current = y;
        viewportHRef.current = height;
    }, []);

    const ctx = React.useMemo(
        () => ({ scrollRef, lastYRef, viewportYRef, viewportHRef }),
        [scrollRef]
    );

    return (
        <TreeCtx.Provider value={ctx}>
            <ThemedYStack f={1} mih={0} onLayout={onLayout}>
                <Animated.ScrollView
                    ref={scrollRef}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingBottom: 12 }}
                >
                    <ThemedYStack container>
                        {root.map((c) => (
                            <ProductCategoryBranch key={c.id} id={c.id} level={level} />
                        ))}
                    </ThemedYStack>
                </Animated.ScrollView>
            </ThemedYStack>
        </TreeCtx.Provider>
    );
});

export const ProductCategoryBranch = memo(({ id, level = 0 }: { id: number; level?: number }) => {
    const node = useCategoryById(id)!;
    const children = useVisibleChildren(id);
    const hasChildren = children.length > 0;

    const isExpanded = useIsExpanded(id);
    const toggle = useToggleExpanded();

    return (
        <AnimatedR.View layout={LinearTransition.duration(150)}>
            <ThemedYStack>
                <ThemedXStack>
                    <ProductCategoryTreeItem
                        productCategory={node}
                        level={level}
                        isExpanded={isExpanded}
                        hasChildren={hasChildren}
                        handleExpand={toggle}
                    />
                </ThemedXStack>

                {isExpanded && hasChildren && (
                    <AnimatedR.View
                        entering={FadeIn.duration(150)}
                        exiting={FadeOut.duration(120)}
                        layout={LinearTransition.duration(150)}
                        collapsable={false}
                        style={{ width: '100%' }}
                    >

                        <ThemedYStack pl="$4">
                            {children.map((child) => (
                                <ProductCategoryBranch key={child.id} id={child.id} level={level + 1} />
                            ))}
                        </ThemedYStack>
                    </AnimatedR.View>
                )}
            </ThemedYStack>
        </AnimatedR.View>
    );
});

interface RenderItemProps {
    productCategory: any;
    isExpanded: boolean;
    level: number;
    hasChildren: boolean;
    handleExpand: (id: number) => void;
}

const ProductCategoryTreeItem = React.memo(({
    productCategory, isExpanded, level, hasChildren, handleExpand,
}: RenderItemProps): JSX.Element => {
    const { linkProps } = useCanonicalNavigation();
    const ctx = React.useContext(TreeCtx);
    const INDENT = React.useMemo(() => getTokenValue('$2', 'space'), []);

    const rowRef = React.useRef(null);
    const MIN_SPACE_BELOW = 160;

    const ensureRoomBelow = React.useCallback(() => {
        if (!ctx?.scrollRef.current || !rowRef.current) return;

        const node = findNodeHandle(rowRef.current)!;
        UIManager.measureInWindow(node, (_x, y, _w, h) => {
            // visible bottom of this tree in window coords:
            const visibleBottom = ctx.viewportYRef.current + ctx.viewportHRef.current;
            const rowBottom = y + h;
            const deficit = MIN_SPACE_BELOW - (visibleBottom - rowBottom);
            if (deficit > 0) {
                ctx.scrollRef.current?.scrollTo({
                    x: 0,
                    y: ctx.lastYRef.current + deficit,
                    animated: true,
                });
            }
        });
    }, [ctx]);

    return (
        <ThemedXStack ref={rowRef} w="100%" ai="center" gap="$2" mb="$2">
            <ThemedXStack ml={level * INDENT} f={1}>
                <Link {...linkProps('product-category', productCategory)} asChild>
                    <ThemedButton theme="shade" f={1}>
                        <ThemedText f={1} letterSpacing={0.5}>
                            {productCategory.name}
                        </ThemedText>
                    </ThemedButton>
                </Link>
            </ThemedXStack>

            <ThemedButton
                fs={1}
                theme="shade"
                circular
                onPress={() => { ensureRoomBelow(); handleExpand(productCategory.id); }}
                disabled={!hasChildren}
                opacity={hasChildren ? 1 : 0}
                pointerEvents={hasChildren ? 'auto' : 'none'}
            >
                {hasChildren && <AnimatedListExpansionIcon expanded={isExpanded} />}
            </ThemedButton>
        </ThemedXStack>
    );
});

const AnimatedListExpansionIcon = ({ expanded }: { expanded: boolean }) => {
    const rotation = useSharedValue(expanded ? 180 : 0);
    React.useEffect(() => {
        rotation.value = withTiming(expanded ? 180 : 0, { duration: 150 });
    }, [expanded]);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ rotateZ: `${rotation.value}deg` }] }));
    return (
        <AnimatedR.View style={animatedStyle}>
            <ChevronDown />
        </AnimatedR.View>
    );
};
