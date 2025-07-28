import { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { Menu } from '@tamagui/lucide-icons';
import { useNavigation } from 'expo-router';
import { JSX } from 'react';
import { Button, H3, XStack } from 'tamagui';

export const CustomHeader = ({ options }: DrawerHeaderProps): JSX.Element => {
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <XStack
            height={140}
            backgroundColor="$background"
            ai="center"
            jc="space-between"

            flex={1}
            paddingTop={40}
            paddingHorizontal="$3"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            theme="secondary"

        >
            <Button
                onPress={openDrawer}
                size="$6"
                chromeless
                padding="$3"

            >
                <Menu />
            </Button>
            <H3>Hunde-sport.no</H3>
        </XStack>
    );
};
