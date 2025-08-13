import { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { Menu } from '@tamagui/lucide-icons';
import { useNavigation } from 'expo-router';
import { JSX } from 'react';
import { H4, Theme, XStack } from 'tamagui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

export const CustomHeader = (props: DrawerHeaderProps): JSX.Element => {

    const navigation = useNavigation();
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <Theme name="tertiary">
            <XStack
                ai="center"
                jc="space-between"
                p="$3"
                bbw={2}
                boc="$borderColor"
                gap="$3"
            >
                <ThemedLinearGradient />
                <ThemedButton
                    onPress={openDrawer}
                    circular
                >
                    <Menu />
                </ThemedButton>
                <H4>{props.options.title}</H4>
            </XStack>
        </Theme>
    );
};
