import { THEME_HEADER } from '@/config/app';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { Menu } from '@tamagui/lucide-icons';
import { useNavigation } from 'expo-router';
import { JSX } from 'react';
import { H4, XStack } from 'tamagui';
import { ThemedButton } from '../ui/themed-components/ThemedButton';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

export const CustomHeader = (props: DrawerHeaderProps): JSX.Element => {

    const navigation = useNavigation();
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    //    const theme = resolveTheme(props.route.name);
    const theme = THEME_HEADER;

    return (
        <XStack
            theme={theme}
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
                h="$6"
                w="$6"
            >
                <Menu />
            </ThemedButton>
            <H4>{props.options.title}</H4>
        </XStack>
    );
};
