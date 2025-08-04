import { BottomBar } from '@/components/menu/BottomBar';
import { ShoppingCartScreen } from '@/screens/ShoppingCartScreen';
import { JSX } from 'react';
import { YStack } from 'tamagui';

const Page = (): JSX.Element => {
    return (
        <YStack flex={1}>
            <ShoppingCartScreen />
            <BottomBar />
        </YStack>
    );
};

export default Page;
