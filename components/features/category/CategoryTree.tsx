import { useCategories } from '@/hooks/data/Category';
import { Category } from '@/models/Category';
import { ChevronDown, ChevronRight } from '@tamagui/lucide-icons';
import { usePathname } from 'expo-router';
import React, { JSX, useCallback, useState } from 'react';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Spinner, View, XStack, YStack } from 'tamagui';

export type RenderItemProps = {
    category: Category;
    level: number;
    isActive: boolean;
    isExpanded: boolean;
};

export type CategoryTreeProps = {
    parentId?: number;
    renderItem: (props: RenderItemProps) => JSX.Element;
    iconOpen?: JSX.Element;
    iconClose?: JSX.Element;
};

type CategoryTreeBranchProps = {
    category: Category;
    level: number;
    isExpanded: boolean;
    onExpand: (id: number) => void;
    iconOpen: JSX.Element;
    iconClose: JSX.Element;
} & Omit<CategoryTreeProps, 'parentId'>;

const CategoryTreeBranch = ({ category, level, isExpanded, onExpand, renderItem, iconOpen, iconClose }: CategoryTreeBranchProps) => {
    const pathname = usePathname();
    const isActive = pathname.includes(`/category/${category.id}`);
    const { items: subcategories } = useCategories(category.id, { autoload: true });
    const hasChildren = subcategories.length > 0;

    const button = isExpanded ? iconOpen : iconClose;

    const expandButton = (
        <View opacity={hasChildren ? 1 : 0}>
            {React.cloneElement(button, {
                onPress: () => onExpand(category.id),
                disabled: !hasChildren,
            })}
        </View>
    );

    return (
        <Animated.View key={category.id} layout={LinearTransition}>
            <YStack>
                <XStack ml={level * 20} flex={1}>
                    {renderItem({ category, level, isActive, isExpanded })}

                    <XStack ai="center" >
                        {expandButton}
                    </XStack>
                </XStack >

                {isExpanded && (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <CategoryTree
                            parentId={category.id}
                            renderItem={renderItem}
                            iconOpen={iconOpen}
                            iconClose={iconClose}
                        />
                    </Animated.View>
                )}

            </YStack>
        </Animated.View >
    );
};

const DefaultIconOpen = <ChevronDown size="$4" />;
const DefaultIconClose = <ChevronRight size="$4" />;

export const CategoryTree = ({ parentId = 0, renderItem, iconOpen = DefaultIconOpen, iconClose = DefaultIconClose }: CategoryTreeProps): JSX.Element => {
    const { items: categories, isFetchingNextPage } = useCategories(parentId, { autoload: true });
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const handleExpand = useCallback((categoryId: number) => {
        setExpanded(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
    }, []);

    return (
        <YStack>
            {categories.map(category => (
                <CategoryTreeBranch
                    key={category.id}
                    category={category}
                    level={parentId === 0 ? 0 : 1}
                    isExpanded={!!expanded[category.id]}
                    onExpand={handleExpand}
                    renderItem={renderItem}
                    iconOpen={iconOpen}
                    iconClose={iconClose}
                />
            ))}
            {isFetchingNextPage && (
                <YStack flex={1} ai="center" jc="center" marginVertical="$2">
                    <Spinner size="small" />
                </YStack>
            )}
        </YStack>
    );
};
