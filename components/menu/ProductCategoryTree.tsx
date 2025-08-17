import { ProductCategory } from '@/domain/ProductCategory';
import { useCanonicalNav } from '@/hooks/useCanonicalNav';
import { useCategoryById, useVisibleChildren } from '@/stores/productCategoryStore';
import { ChevronDown } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import { JSX, memo, useEffect } from 'react';
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { getTokenValue } from 'tamagui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedText } from '../ui/themed-components/ThemedText';

import React from 'react';
import { ThemedXStack, ThemedYStack } from '../ui';

export const ProductCategoryTree = memo(({ level = 0 }: { level?: number }) => {
    const root = useVisibleChildren(level);
    const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});
    const toggle = React.useCallback((id: number) => {
        setExpanded((e) => ({ ...e, [id]: !e[id] }));
    }, []);

    return (
        <ThemedYStack f={1} container >
            {root.map((c) => (
                <ProductCategoryBranch
                    id={c.id}
                    key={c.id}
                    level={level}
                    expanded={expanded}
                    toggle={toggle}
                />
            ))}
        </ThemedYStack>
    );
});


export const ProductCategoryBranch = memo(({
    id,
    level = 0,
    expanded,
    toggle
}: { id: number; level?: number, expanded: Record<number, boolean>, toggle: (id: number) => void }) => {
    const node = useCategoryById(id)!;
    const children = useVisibleChildren(id);
    const hasChildren = children.length > 0;
    const isExpanded = expanded[id];

    return (
        <Animated.View layout={LinearTransition}>
            <ThemedYStack f={1}>
                <ThemedXStack f={1}>
                    <ProductCategoryTreeItem
                        productCategory={node}
                        level={level}
                        isExpanded={isExpanded}
                        hasChildren={hasChildren}
                        handleExpand={toggle}
                    />
                </ThemedXStack>

                {isExpanded && hasChildren && (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <ThemedYStack pl="$4">
                            {children.map((child) => (
                                <ProductCategoryBranch
                                    key={child.id}
                                    id={child.id}
                                    level={level + 1}
                                    expanded={expanded}
                                    toggle={toggle}
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
    handleExpand: (id: number) => void;
}

const ProductCategoryTreeItem = React.memo(({
    productCategory,
    isExpanded,
    level,
    hasChildren,
    handleExpand,
}: RenderItemProps): JSX.Element => {

    const spacing = React.useMemo(() => getTokenValue('$2', 'space'), []);

    const { linkProps } = useCanonicalNav();

    return (
        <ThemedXStack f={1} ai="center" gap="$2" mb="$2">
            <ThemedXStack ml={level * spacing} f={1}>
                <Link {...linkProps('product-category', productCategory)} asChild>
                    <ThemedButton theme="shade" f={1} >
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
                onPress={() => handleExpand(productCategory.id)}
                disabled={!hasChildren}
                opacity={hasChildren ? 1 : 0}
                pointerEvents={hasChildren ? 'auto' : 'none'}
            >
                {hasChildren && <AnimatedListExpansionIcon expanded={isExpanded} size="$4" />}
            </ThemedButton>
        </ThemedXStack>
    );
});


const AnimatedListExpansionIcon = ({ expanded, size }: { expanded: boolean, size: string }) => {
    const rotation = useSharedValue(expanded ? 180 : 0);

    useEffect(() => {
        rotation.value = withTiming(expanded ? 180 : 0, { duration: 150 });
    }, [expanded]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <ChevronDown />
        </Animated.View>
    );
};
