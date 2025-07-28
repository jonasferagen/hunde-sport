import { useCategories } from '@/hooks/data/Category';
import { Category } from '@/models/Category';
import { ChevronDown, ChevronRight } from '@tamagui/lucide-icons';
import { usePathname } from 'expo-router';
import React, { JSX, useCallback, useState } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Spinner, XStack, YStack } from 'tamagui';

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

const DefaultIconOpen = <ChevronDown size="$4" />;
const DefaultIconClose = <ChevronRight size="$4" />;

export const CategoryTree = ({ parentId = 0, renderItem, iconOpen = DefaultIconOpen, iconClose = DefaultIconClose }: CategoryTreeProps): JSX.Element => {
    const { items: categories, isFetchingNextPage } = useCategories(parentId, { autoload: true });
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    const pathname = usePathname();

    const handleExpand = useCallback((categoryId: number) => {
        setExpanded(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
    }, []);

    const renderCategory = (category: Category, level: number): JSX.Element => {
        const isExpanded = !!expanded[category.id];
        const hasChildren = categories.length > 0;
        const isActive = pathname.includes(`/category/${category.id}`);

        return (
            <Animated.View key={category.id} layout={LinearTransition}>
                <XStack>
                    <YStack>
                        <XStack marginLeft={level * 20} width="$4" ai="center">
                            {hasChildren ? (
                                <YStack onPress={() => handleExpand(category.id)}
                                    padding="$2"
                                    ai="center"
                                    jc="center">
                                    {isExpanded ? iconOpen : iconClose}
                                </YStack>
                            ) : <YStack width="$4" />}
                        </XStack>
                        {isExpanded && <YStack
                            position="absolute"
                            top="$4"
                            bottom={0}
                            left={level + 20 + 20}
                            width={1}
                            backgroundColor="$borderColor" />}
                    </YStack>

                    <YStack flex={1}>
                        {renderItem({ category, level, isActive, isExpanded })}

                        {isExpanded && (
                            <CategoryTree
                                parentId={category.id}
                                renderItem={renderItem}
                                iconOpen={iconOpen}
                                iconClose={iconClose}
                            />
                        )}
                    </YStack>
                </XStack>
            </Animated.View>
        );
    };

    return (
        <YStack>
            {categories.map(category => renderCategory(category, 0))}
            {isFetchingNextPage && (
                <YStack flex={1} ai="center" jc="center" marginVertical="$2">
                    <Spinner size="small" />
                </YStack>
            )}
        </YStack>
    );
};
