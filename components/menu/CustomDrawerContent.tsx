import { CategoryTree, RenderItemProps } from '@/components/features/category/CategoryTree';
import { routes } from '@/config/routes';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { LinearGradient } from '@tamagui/linear-gradient';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Button, H4, SizableText, Theme, useTheme, YStack } from 'tamagui';

const CategoryTreeItem = ({ category, isActive, isExpanded }: RenderItemProps) => {
    const theme = useTheme();

    return (
        <Link href={routes.category(category)} asChild>
            <YStack
                flex={1}
                paddingVertical="$2.5"
                paddingHorizontal="$3"
                marginRight="$2.5"
                marginVertical="$1"
                borderRadius="$4"
                pressStyle={{ backgroundColor: theme.backgroundFocus.val }}
                backgroundColor={isActive ? theme.backgroundFocus.val : theme.background.val}
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
        <YStack
            flex={1}
            borderRightWidth={1}
            borderRightColor="$borderColor"
            shadowColor="$shadowColorFocus"
            shadowOffset={{ width: 2, height: 0 }}
            shadowOpacity={0.25}
            shadowRadius={8}
        >
            <LinearGradient
                colors={['$background', '$backgroundPress']}
                start={[0, 0]}
                end={[1, 1]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <DrawerContentScrollView {...props}>
                <Theme name="light">
                    <YStack gap="$1" paddingVertical="$1">
                        <DrawerItemList {...props} />
                        <H4 marginVertical="$2">Våre kategorier</H4>
                        <CategoryTree
                            renderItem={(itemProps) => <CategoryTreeItem {...itemProps} />}
                            iconOpen={<Button theme="secondary" circular><ChevronUp size="$4" /></Button>}
                            iconClose={<Button theme="secondary" circular><ChevronDown size="$4" /></Button>} />
                    </YStack>
                </Theme>
            </DrawerContentScrollView>
        </YStack>
    );
}
