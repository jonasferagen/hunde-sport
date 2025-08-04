import { BottomBar } from '@/components/menu/BottomBar';
import { CartScreen } from '@/screens/CartScreen';
import { JSX } from 'react';
import { YStack } from 'tamagui';

const Page = (): JSX.Element => {
    return (
        <YStack f={1}>
            <CartScreen />
            <BottomBar />
        </YStack>
    );
};

export default Page;
