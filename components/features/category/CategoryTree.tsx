import { useCategories } from '@/hooks/data/Category';
import { Category } from '@/models/Category';
import { ChevronDownCircle, ChevronUpCircle } from '@tamagui/lucide-icons';
import React, { JSX, useCallback, useState } from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SizableText, Spinner, View, XStack, YStack } from 'tamagui';

export type RenderItemProps = {
    category: Category;
    level: number;
};

export type CategoryTreeProps = {
    parentId?: number;
    renderItem: (props: RenderItemProps) => JSX.Element;
    iconOpen?: JSX.Element;
    iconClose?: JSX.Element;
};

const DefaultIconOpen = <ChevronUpCircle fontSize="$4" />;
const DefaultIconClose = <ChevronDownCircle fontSize="$4" />;

export const CategoryTree = ({ parentId = 0, renderItem, iconOpen = DefaultIconOpen, iconClose = DefaultIconClose }: CategoryTreeProps): JSX.Element => {
    const { items: categories, isFetchingNextPage } = useCategories(parentId, { autoload: true });
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const handleExpand = useCallback((categoryId: number) => {
        setExpanded(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
    }, []);

    const renderCategory = (category: Category, level: number): JSX.Element => {
        const isExpanded = !!expanded[category.id];
        const hasChildren = category.count > 0;

        return (
            <Animated.View key={category.id} layout={LinearTransition} style={{ overflow: 'hidden' }}>
                <YStack
                    backgroundColor={isExpanded ? '$backgroundFocus' : 'transparent'}
                    borderRadius="$4"
                    marginLeft={level * 10}
                >
                    <XStack ai="center" jc='space-between' flex={1} >
                        <View flex={1}>
                            {renderItem({ category, level })}
                        </View>

                        {hasChildren && (
                            <YStack onPress={() => handleExpand(category.id)} padding="$2" >
                                {isExpanded ? iconOpen : iconClose}
                                <SizableText>{category.count}</SizableText>
                            </YStack>
                        )}
                    </XStack>

                    {isExpanded && (
                        <CategoryTree
                            parentId={category.id}
                            renderItem={renderItem}
                            iconOpen={iconOpen}
                            iconClose={iconClose}
                        />
                    )}
                </YStack>
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
