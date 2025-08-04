import { BottomBar } from '@/components/menu/BottomBar';
import { SearchScreen } from '@/screens/SearchScreen';
import { JSX } from 'react';
import { YStack } from 'tamagui';

const Page = (): JSX.Element => {
    return (
        <YStack flex={1}>
            <SearchScreen />
            <BottomBar />
        </YStack>
    );
};

export default Page;
