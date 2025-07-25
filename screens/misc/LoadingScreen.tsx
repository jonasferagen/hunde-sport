import React from 'react';
import { YStack } from 'tamagui';
import { ThemedSpinner } from '../../components/ui/ThemedSpinner';

export const LoadingScreen = () => {

    return (
        <YStack flex={1} jc="center" ai="center">
            <ThemedSpinner size="large" />
        </YStack>
    );
};
