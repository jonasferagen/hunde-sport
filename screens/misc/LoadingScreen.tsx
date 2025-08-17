import { Prof } from '@/lib/debug/prof';
import React from 'react';
import { YStack } from 'tamagui';
import { ThemedSpinner } from '../../components/ui/themed-components/ThemedSpinner';

export const LoadingScreen = () =>
    <Prof id="LoadingScreen">

        <YStack f={1} jc="center" ai="center" mih="$10">
            <ThemedSpinner size="large" />
        </YStack>;
    </Prof>
