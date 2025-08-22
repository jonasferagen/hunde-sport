// components/lists/EdgeFadesOverlay.tsx
import { ThemedLinearGradient } from '@/components/ui'; // or your gradient
import { rgba } from 'polished';
import React, { useMemo } from 'react';
import { getVariableValue, useTheme, useThemeName, XStack, YStack } from 'tamagui';



export function EdgeFadesOverlay({
    orientation,
    widthToken = '$6',  // for horizontal fades
    heightToken = '$6', // for vertical fades
    visibleStart,
    visibleEnd,
    bg
}: {
    orientation: 'horizontal' | 'vertical';
    widthToken?: any;
    heightToken?: any;
    visibleStart: boolean;
    visibleEnd: boolean;
    bg?: string;
}) {
    const theme = useTheme();
    const defaultColor = useMemo(() => String(getVariableValue(theme.background)), [theme]);
    const color = bg ? bg : defaultColor;
    const transparent = rgba(color, 0);
    const solid = rgba(color, 1);

    if (orientation === 'horizontal') {

        return (
            <>
                {!visibleStart && (
                    <XStack pos="absolute" l={0} t={0} b={0} w={widthToken} pe="none">
                        <ThemedLinearGradient colors={[transparent, solid]} start={[1, 0]} end={[0, 0]} />
                    </XStack>
                )}
                {!visibleEnd && (
                    <XStack pos="absolute" r={0} t={0} b={0} w={widthToken} pe="none">
                        <ThemedLinearGradient colors={[solid, transparent]} start={[1, 0]} end={[0, 0]} />
                    </XStack>
                )}
            </>
        );
    }

    // vertical
    return (
        <>
            {!visibleStart && (
                <YStack pos="absolute" t={0} l={0} r={0} h={heightToken} pe="none">
                    <ThemedLinearGradient colors={[transparent, solid]} start={[0, 1]} end={[0, 0]} />
                </YStack>
            )}
            {!visibleEnd && (
                <YStack pos="absolute" b={0} l={0} r={0} h={heightToken} pe="none">
                    <ThemedLinearGradient colors={[solid, transparent]} start={[0, 1]} end={[0, 0]} />
                </YStack>
            )}
        </>
    );
}
