import { BottomBar } from '@/components/menu/BottomBar';
import { HomeScreen } from '@/screens/HomeScreen';
import { JSX } from 'react';
import { YStack } from 'tamagui';

const Page = (): JSX.Element => {
    return (
        <YStack flex={1}>
            <HomeScreen />
            <BottomBar />
        </YStack>
    );
};

export default Page;
