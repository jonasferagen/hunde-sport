import { BottomBar } from '@/components/menu/BottomBar';
import { CategoryScreen } from '@/screens/CategoryScreen';
import { JSX } from 'react';
import { YStack } from 'tamagui';

const Page = (): JSX.Element => {
    return (
        <YStack flex={1}>
            <CategoryScreen />
            <BottomBar />
        </YStack>
    );
};

export default Page;
