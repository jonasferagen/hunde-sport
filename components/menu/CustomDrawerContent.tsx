import { CategoryTree, RenderItemProps } from '@/components/features/category/CategoryTree';
import { routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { Link } from 'expo-router';
import React from 'react';
import { H3, SizableText, Theme, useTheme, YStack } from 'tamagui';

const CategoryTreeItem = ({ category, isActive, isExpanded }: RenderItemProps) => {
    const theme = useTheme();

    return (
        <Link href={routes.category(category)} asChild>
            <YStack
                paddingVertical="$2.5"
                paddingHorizontal="$3"
                marginRight="$2.5"
                borderRadius="$4"
                pressStyle={{ backgroundColor: theme.backgroundFocus.val }}
                backgroundColor={isActive ? theme.backgroundFocus.val : 'transparent'}
            >
                <SizableText
                    color={isActive ? theme.color.val : theme.color10.val}
                    fontWeight={isActive ? '800' : 'normal'}
                    size="$5"
                >
                    {category.name}
                </SizableText>
            </YStack>
        </Link>
    );
};

export function CustomDrawerContent(props: DrawerContentComponentProps) {

    return (
        <DrawerContentScrollView {...props}>
            <Theme name="primary">
                <YStack gap="$1" paddingVertical="$1">
                    <DrawerItemList {...props} />
                    <H3 marginHorizontal="$3.5" marginTop="$4">Våre kategorier</H3>
                    <CategoryTree renderItem={(itemProps) => <CategoryTreeItem {...itemProps} />} />
                </YStack>
            </Theme>
        </DrawerContentScrollView>
    );
}
