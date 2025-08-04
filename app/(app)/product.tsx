import { BottomBar } from '@/components/menu/BottomBar';
import { ProductScreen } from '@/screens/ProductScreen';
import { JSX } from 'react';
import { YStack } from 'tamagui';

const Page = (): JSX.Element => {
    return (
        <YStack flex={1}>
            <ProductScreen />
            <BottomBar />
        </YStack>
    );
};

export default Page;
