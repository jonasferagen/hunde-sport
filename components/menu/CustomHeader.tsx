import { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { Menu } from '@tamagui/lucide-icons';
import { useNavigation } from 'expo-router';
import { JSX } from 'react';
import { H4, Theme } from 'tamagui';
import { ThemedXStack } from '../ui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

export const CustomHeader = (props: DrawerHeaderProps): JSX.Element => {

    const navigation = useNavigation();
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    return (
        <Theme name="primary">
            <ThemedXStack
                container
                split
                box
            >
                <ThemedLinearGradient />
                <ThemedButton
                    theme="tint"
                    circular
                    onPress={openDrawer}
                >
                    <Menu />
                </ThemedButton>
                <H4>{props.options.title}</H4>
            </ThemedXStack>
        </Theme>

    );
};
