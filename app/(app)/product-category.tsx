import { BottomBar } from '@/components/menu/BottomBar';
import { ProductCategoryScreen } from '@/screens/ProductCategoryScreen';
import { JSX } from 'react';
import { YStack } from 'tamagui';

const Page = (): JSX.Element => {
    return (
        <YStack flex={1}>
            <ProductCategoryScreen />
            <BottomBar />
        </YStack>
    );
};

export default Page;
