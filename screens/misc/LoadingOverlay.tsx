// LoadingOverlay.tsx
<<<<<<< HEAD
import { useNavProgress } from '@/stores/navProgressStore';
import React from 'react';
import { ActivityIndicator, Animated, Easing, StyleSheet, View } from 'react-native';

const MIN_SHOW_MS = 250;      // avoid flicker
const SHOW_DELAY_MS = 120;    // don’t show for ultra-fast hops

export const LoadingOverlay = React.memo(() => {
    const active = useNavProgress(s => s.active);
    const opacity = React.useRef(new Animated.Value(0)).current;
    const [visible, setVisible] = React.useState(false);
    const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    React.useEffect(() => {
        if (active) {
            if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
            if (!visible) {
                showTimer.current = setTimeout(() => {
                    setVisible(true);
                    Animated.timing(opacity, {
                        toValue: 1, duration: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true,
                    }).start();
                }, SHOW_DELAY_MS);
            }
        } else {
            if (showTimer.current) { clearTimeout(showTimer.current); showTimer.current = null; }
            if (visible) {
                hideTimer.current = setTimeout(() => {
                    Animated.timing(opacity, {
                        toValue: 0, duration: 160, easing: Easing.in(Easing.cubic), useNativeDriver: true,
                    }).start(({ finished }) => {
                        if (finished) setVisible(false);
                    });
                }, MIN_SHOW_MS);
            }
        }
        return () => {
            if (showTimer.current) clearTimeout(showTimer.current);
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, [active, visible, opacity]);

    if (!visible) return null;

    return (
        <Animated.View
            pointerEvents={active ? 'auto' : 'none'}
            style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.04)', opacity }]}
        >
            <View style={{ padding: 14, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.9)' }}>
                <ActivityIndicator />
            </View>
=======
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
>>>>>>> temp
        </Animated.View>
    );
});
