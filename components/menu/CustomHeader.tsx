import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Menu } from '@tamagui/lucide-icons';
import { H4, Theme } from 'tamagui';
import { ThemedButton, ThemedLinearGradient, ThemedXStack } from '../ui/themed-components';

import { getHeaderTitle } from '@react-navigation/elements';

export const CustomHeader = (props: DrawerHeaderProps) => {

    if (!props) {
        console.error("Header props undefined");
        return null;
    }

    const { navigation, route, options } = props;

    const { name } = route?.params as { name: string };

    const title = name === 'index' || name === undefined
        ? 'hunde-sport.no'
        : (name || getHeaderTitle(options, route?.name)) as string;

    return (
        <Theme name="primary">
            <ThemedXStack container split box>
                <ThemedLinearGradient />
                <ThemedButton theme="tint" circular onPress={() => navigation.openDrawer()}>
                    <Menu />
                </ThemedButton>
                <H4 fs={1}>{title}</H4>
            </ThemedXStack>
        </Theme>
    );
};
