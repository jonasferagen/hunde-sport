import { CategoryTree } from '@/components/features/category/CategoryTree';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { Theme, YStack } from 'tamagui';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
    return (
        <DrawerContentScrollView {...props}>
            <Theme name="primary">
                <YStack gap="$1" paddingVertical="$1">
                    <DrawerItemList {...props} />
                    <CategoryTree />
                </YStack>
            </Theme>
        </DrawerContentScrollView>
    );
}
