import { routes } from '@/config/routes';
import { ProductCategory } from '@/models/ProductCategory';
import { Link } from 'expo-router';
import React, { JSX } from 'react';
import { getTokenValue, XStack } from 'tamagui';
import { ThemedButton } from '../ui/ThemedButton';
import { ThemedText } from '../ui/ThemedText';
import { AnimatedListExpansionIcon } from './AnimatedListExpansionIcon';

export interface RenderItemProps {
    productCategory: ProductCategory;
    isExpanded: boolean;
    level: number;
    hasChildren: boolean;
    handleExpand: (id: number) => void;
}

export const ProductCategoryTreeItem = ({
    productCategory,
    isExpanded,
    level,
    hasChildren,
    handleExpand,
}: RenderItemProps): JSX.Element => {

    const spacing = getTokenValue('$2', 'space');

    return (
        <XStack ai="center" gap="$2" f={1}>
            <XStack flex={1} ml={level * spacing}>
                <Link href={routes['product-category'].path(productCategory)} asChild>
                    <ThemedButton f={1} >
                        <ThemedText f={1} letterSpacing={0.5}>
                            {productCategory.name}
                        </ThemedText>
                    </ThemedButton>
                </Link>
            </XStack>

            <ThemedButton
                circular
                onPress={() => handleExpand(productCategory.id)}
                disabled={!hasChildren}
                size="$6"
                opacity={hasChildren ? 1 : 0}
                pointerEvents={hasChildren ? 'auto' : 'none'}
            >
                {hasChildren && <AnimatedListExpansionIcon expanded={isExpanded} size="$4" />}
            </ThemedButton>
        </XStack >
    );
};