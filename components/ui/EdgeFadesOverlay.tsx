import { ThemedLinearGradient } from '@/components/ui';
import { rgba } from 'polished';
import React, { useMemo, useEffect } from 'react';
import { getVariableValue, useTheme, XStack, YStack } from 'tamagui';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

type Props = {
    orientation: 'horizontal' | 'vertical';
    widthToken?: any;   // for horizontal fades (e.g. '$6')
    heightToken?: any;  // for vertical fades (e.g. '$6')
    visibleStart: boolean; // true when at the start edge
    visibleEnd: boolean;   // true when at the end edge
    bg?: string;
    durationMs?: number;
};

export function EdgeFadesOverlay({
    orientation,
    widthToken = '$6',
    heightToken = '$6',
    visibleStart,
    visibleEnd,
    bg,
    durationMs = 140,
}: Props) {
    const theme = useTheme();
    const defaultColor = useMemo(() => String(getVariableValue(theme.background)), [theme]);
    const color = bg ?? defaultColor;
    const transparent = rgba(color, 0);
    const solid = rgba(color, 1);

    // Show scrim when NOT at that edge
    const showStartFade = !visibleStart;
    const showEndFade = !visibleEnd;

    // animated opacities
    const startOp = useSharedValue(showStartFade ? 1 : 0);
    const endOp = useSharedValue(showEndFade ? 1 : 0);

    useEffect(() => {
        startOp.value = withTiming(showStartFade ? 1 : 0, { duration: durationMs });
    }, [showStartFade, durationMs, startOp]);

    useEffect(() => {
        endOp.value = withTiming(showEndFade ? 1 : 0, { duration: durationMs });
    }, [showEndFade, durationMs, endOp]);

    const startStyle = useAnimatedStyle(() => ({ opacity: startOp.value }));
    const endStyle = useAnimatedStyle(() => ({ opacity: endOp.value }));

    if (orientation === 'horizontal') {
        return (
            <>
                <Animated.View
                    style={[{ position: 'absolute', left: 0, top: 0, bottom: 0 }, startStyle]}
                    pointerEvents="none"
                    collapsable={false}
                >
                    <XStack w={widthToken} h="100%">
                        <ThemedLinearGradient colors={[transparent, solid]} start={[1, 0]} end={[0, 0]} />
                    </XStack>
                </Animated.View>

                <Animated.View
                    style={[{ position: 'absolute', right: 0, top: 0, bottom: 0 }, endStyle]}
                    pointerEvents="none"
                    collapsable={false}
                >
                    <XStack w={widthToken} h="100%">
                        <ThemedLinearGradient colors={[solid, transparent]} start={[1, 0]} end={[0, 0]} />
                    </XStack>
                </Animated.View>
            </>
        );
    }

    // vertical
    return (
        <>
            <Animated.View
                style={[{ position: 'absolute', top: 0, left: 0, right: 0 }, startStyle]}
                pointerEvents="none"
                collapsable={false}
            >
                <YStack h={heightToken}>
                    <ThemedLinearGradient colors={[transparent, solid]} start={[0, 1]} end={[0, 0]} />
                </YStack>
            </Animated.View>

            <Animated.View
                style={[{ position: 'absolute', bottom: 0, left: 0, right: 0 }, endStyle]}
                pointerEvents="none"
                collapsable={false}
            >
                <YStack h={heightToken}>
                    <ThemedLinearGradient colors={[solid, transparent]} start={[0, 1]} end={[0, 0]} />
                </YStack>
            </Animated.View>
        </>
    );
}
