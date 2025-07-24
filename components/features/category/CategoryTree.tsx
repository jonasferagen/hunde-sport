import { routes } from '@/config/routes';
import { useCategories } from '@/hooks/data/Category';
import { Category } from '@/models/Category';
import { ChevronDownCircle, ChevronUpCircle } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SizableText, Spinner, View, XStack, YStack } from 'tamagui';

interface CategoryTreeItemProps {
    category: Category;
    level: number;
    ancestors: Category[];
    isExpanded: boolean;
    onExpand: (categoryId: number) => void;
    isActive: boolean;
};

const CategoryTreeItem = ({ category, level, ancestors, isExpanded, onExpand, isActive }: CategoryTreeItemProps) => {
    const { items: categories } = useCategories(category.id, { autoload: true });
    const hasChildren = categories.length > 0; // subcategories

    const handleExpand = useCallback(() => {
        onExpand(category.id);
    }, [onExpand, category.id]);


    return (
        <Animated.View layout={LinearTransition} style={{ overflow: 'hidden' }}>
            <YStack
                backgroundColor={isExpanded ? '$backgroundFocus' : 'transparent'}
                borderRadius="$4"
                marginLeft={level * 20}
            >
                <XStack ai="center" jc='space-between' >
                    <Link href={routes.category(category)} asChild>
                        <Pressable>
                            <XStack ai="center" paddingVertical="$3" width={'100%'} >
                                <SizableText size="$3" fontSize="$4" marginLeft="$2">{category.name}</SizableText>
                            </XStack>
                        </Pressable>
                    </Link>
                    {hasChildren && (
                        <YStack onPress={handleExpand} padding="$2" >
                            {isExpanded ? <ChevronUpCircle size="$3" /> : <ChevronDownCircle size="$3" />}
                        </YStack>
                    )}
                </XStack>
                {
                    isExpanded && (
                        <Animated.View entering={FadeIn} exiting={FadeOut} style={{ overflow: 'hidden' }}>
                            <CategorySubTree
                                categoryId={category.id}
                                level={level + 1}
                                ancestors={ancestors}
                            />
                        </Animated.View>
                    )
                }
            </YStack >
        </Animated.View >
    );
};

interface CategorySubTreeProps {
    categoryId: number;
    level?: number;
    ancestors?: Category[];
};

const CategorySubTree = ({ categoryId, level = 0, ancestors = [] }: CategorySubTreeProps) => {
    const { items: categories, isFetchingNextPage } = useCategories(categoryId);

    const activeChild = categories.find((c: Category) => ancestors.some(b => b.id === c.id));
    const [expandedItemId, setExpandedItemId] = useState<number | null>(activeChild?.id ?? null);

    const handleToggleExpand = (itemId: number) => {
        setExpandedItemId(prevId => (prevId === itemId ? null : itemId));
    };

    return (
        <YStack marginHorizontal={0}>
            <View>
                {categories.map((category: Category) => {
                    return (
                        <CategoryTreeItem
                            key={category.id}
                            category={category}
                            level={level}
                            ancestors={ancestors.concat(category)}
                            isExpanded={expandedItemId === category.id}
                            onExpand={handleToggleExpand}
                            isActive={ancestors.some(b => b.id === category.id)}
                        />
                    );
                })}
                {isFetchingNextPage && (
                    <YStack flex={1} ai="center" jc="center" marginVertical="$2">
                        <Spinner size="small" />
                    </YStack>
                )}
            </View>
        </YStack>
    );
};

interface CategoryTreeProps {
    style?: StyleProp<ViewStyle>;
}

export const CategoryTree = React.memo(({ style }: CategoryTreeProps) => {

    return <View style={style as any}>
        <CategorySubTree categoryId={0} />
    </View>;
});
