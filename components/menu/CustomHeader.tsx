import { routes } from '@/config/routes';
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions, useRoute } from '@react-navigation/native';
import { LinearGradient } from '@tamagui/linear-gradient';
import { Menu } from '@tamagui/lucide-icons';
import { useNavigation } from 'expo-router';
import { JSX } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XStack } from 'tamagui';
import { ThemedButton } from '../ui/ThemedButton';
import { ThemedText } from '../ui/ThemedText';

export const CustomHeader = ({ options }: DrawerHeaderProps): JSX.Element => {

    const route = useRoute();
    const insets = useSafeAreaInsets();
    const routeName = route.name;
    const themeName = routes[routeName]?.theme || 'primary';



    const navigation = useNavigation();
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const paddingTop = 70;
    const height = insets.top + paddingTop + 20;

    return (
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
            t={themeName}

        >
            <LinearGradient
                colors={['$background', '$backgroundPress']}
                start={[0, 1]}
                end={[1, 0]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <ThemedButton
                onPress={openDrawer}
                size="$6"
                circular

            >
                <Menu />
            </ThemedButton>
            <ThemedText fontSize="$4">{options.title}</ThemedText>
        </XStack>
    );
};
