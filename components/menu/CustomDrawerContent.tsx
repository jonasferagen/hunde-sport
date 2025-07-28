import { CategoryTree, RenderItemProps } from '@/components/features/category/CategoryTree';
import { routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { Link } from 'expo-router';
import React from 'react';
import { Button, H3, SizableText, Theme, XStack, YStack } from 'tamagui';

const CategoryTreeItem = ({ category, level }: RenderItemProps) => {
    return (
        <Link href={routes.category(category)} asChild>
            <Button flex={1} alignItems="flex-start" pressStyle={{ opacity: 0.7 }}>
                <XStack paddingVertical="$2" flex={1}>
                    <SizableText size="$5">{category.name}</SizableText>
                </XStack>
            </Button>
        </Link>
    );
};

export function CustomDrawerContent(props: DrawerContentComponentProps) {

    return (
        <DrawerContentScrollView {...props}>
            <Theme name="primary">
                <YStack gap="$1" paddingVertical="$1">
                    <DrawerItemList {...props} />
                    <H3>Våre kategorier</H3>
                    <CategoryTree renderItem={(itemProps) => <CategoryTreeItem {...itemProps} />} />
                </YStack>
            </Theme>
        </DrawerContentScrollView>
    );
}
