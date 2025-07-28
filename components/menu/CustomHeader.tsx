import { DrawerHeaderProps } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { LinearGradient } from '@tamagui/linear-gradient';
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
            minHeight={100}
            height={100}
            ai="center"
            jc="space-between"
            paddingTop={40}
            paddingHorizontal="$3"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            theme="secondary"
        >
            <LinearGradient
                colors={['$background', '$backgroundPress']}
                start={[0, 1]}
                end={[0, 0]}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <Button
                onPress={openDrawer}
                size="$6"
                circular
                padding="$3"
                backgroundColor="transparent"
                pressStyle={{ backgroundColor: '$backgroundFocus' }}
                borderColor="transparent"
            >
                <Menu />
            </Button>
            <H3>{options.title}</H3>
        </XStack>
    );
};
