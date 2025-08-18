// LoadingOverlay.tsx
import { ThemedSpinner, ThemedYStack } from '@/components/ui';
import { useNavProgress } from '@/stores/navProgressStore';
import React from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

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
            <ThemedYStack ai="center" jc="center" w="100%" h="100%" bg="black" o={.3} >
                <ThemedSpinner size="large" />
            </ThemedYStack>
        </Animated.View>
    );
});
