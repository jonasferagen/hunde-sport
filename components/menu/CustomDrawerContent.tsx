import { CategoryTree } from '@/components/features/category/CategoryTree';
import {
    DrawerContentComponentProps,
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import { YStack } from 'tamagui';

export function CustomDrawerContent(props: DrawerContentComponentProps) {
    return (
        <DrawerContentScrollView {...props}>
            <YStack gap="$1" paddingVertical="$1">
                <DrawerItemList {...props} />
                <CategoryTree />
            </YStack>
        </DrawerContentScrollView>
    );
}
