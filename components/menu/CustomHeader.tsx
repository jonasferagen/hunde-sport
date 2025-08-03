import { resolveTheme } from '@/config/routes';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { Menu } from '@tamagui/lucide-icons';
import { useNavigation } from 'expo-router';
import { JSX } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme, XStack } from 'tamagui';
import { ThemedButton } from '../ui/ThemedButton';
import { ThemedLinearGradient } from '../ui/ThemedLinearGradient';
import { ThemedText } from '../ui/ThemedText';

export const CustomHeader = ({ options }: DrawerHeaderProps): JSX.Element => {

    const navigation = useNavigation();
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const theme = resolveTheme();
    const insets = useSafeAreaInsets();
    const paddingTop = 70;
    const height = insets.top + paddingTop + 20;

    return <Theme name={theme}>
        <XStack
            mih={height}
            h={height}
            ai="center"
            jc="space-between"
            pt={paddingTop}
            px="$3"
            bbw={2}
            boc="$borderColor"
            gap="$3"
        >
            <ThemedLinearGradient />
            <ThemedButton
                onPress={openDrawer}
                size="$6"
                circular

            >
                <Menu />
            </ThemedButton>
            <ThemedText fontSize="$4">{options.title}</ThemedText>
        </XStack>
    </Theme>
};
