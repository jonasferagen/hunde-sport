// LoadingOverlay.tsx
import { ThemedYStack } from '@/components/ui';
import { ThemedSpinner } from '@/components/ui/themed-components/ThemedSpinner';
import { useNavProgress } from '@/stores/navProgressStore'; // { active, start, stop }
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

export const LoadingOverlay = React.memo(() => {
    // always-mounted, controlled only by shared value
    const opacity = useSharedValue(0);
    const [pe, setPE] = useState<'none' | 'auto'>('none'); // gate touches (React state is fine)
    const lastActive = useRef<boolean>(useNavProgress.getState().active);
    useEffect(() => {
        // subscribe to store; manage dedupe locally to avoid re-animating on same value

        const unsub = useNavProgress.subscribe((state) => {
            const active = state.active;
            if (active === lastActive.current) return;
            lastActive.current = active;
            if (active) {
                setPE('auto'); // block touches immediately
                opacity.value = withTiming(1, { duration: 140 });
            } else {
                opacity.value = withTiming(0, { duration: 140 }, (finished) => {
                    if (finished) runOnJS(setPE)('none'); // let touches pass when fully hidden
                });
            }
        });
        return unsub;
    }, [opacity]);

    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View
            pointerEvents={pe}
            style={[
                StyleSheet.absoluteFillObject,
                { zIndex: 1000, justifyContent: 'center', alignItems: 'center' },
                animStyle,
            ]}
        >
            {/* your content */}
            <ThemedYStack ai="center" jc="center" w="100%" h="100%" bg="black" o={0.3}>
                <ThemedSpinner size="large" />
            </ThemedYStack>
        </Animated.View>
    );
});
