// components/misc/BottomMoreHint.tsx
import { ThemedText, ThemedXStack } from '@/components/ui';
import { THEME_HINT } from '@/config/app';
import { ChevronDown } from '@tamagui/lucide-icons';
import React from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

export type BottomMoreHintHandle = {
    kick: () => void;   // show now + restart idle timer
    hide: () => void;   // hide immediately
};

type Props = {
    enabled: boolean;       // parent says if hint is relevant (hasMore, not at end, etc.)
    shown: number;
    total: number;
    idleMs?: number;        // default 600
};

export const BottomMoreHint = React.forwardRef<BottomMoreHintHandle, Props>(
    ({ enabled, shown, total, idleMs = 600 }, ref) => {
        const [visible, setVisible] = React.useState(false);
        const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

        const clear = React.useCallback(() => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = null;
        }, []);

        const kick = React.useCallback(() => {
            if (!enabled) return;
            setVisible(true);
            clear();
            timer.current = setTimeout(() => setVisible(false), idleMs);
        }, [enabled, idleMs, clear]);

        const hide = React.useCallback(() => {
            clear();
            setVisible(false);
        }, [clear]);

        React.useImperativeHandle(ref, () => ({ kick, hide }), [kick, hide]);

        // If hint becomes disabled, hide immediately
        React.useEffect(() => {
            if (!enabled) hide();
        }, [enabled, hide]);

        React.useEffect(() => () => clear(), [clear]);

        const aStyle = useAnimatedStyle(() => ({
            opacity: withTiming(visible ? 0.9 : 0, { duration: 180 }),
            transform: [{ translateY: withTiming(visible ? 0 : 8, { duration: 180 }) }],
            pointerEvents: 'none'
        }));

        return (
            <Animated.View
                style={[{ position: 'absolute', right: 12, bottom: 12, alignItems: 'center' }, aStyle]}
                pointerEvents="box-none"
            >
                <ThemedXStack theme={THEME_HINT} ai="center" jc="center" box br="$5" px="$3" py="$1.5">
                    <ThemedText size="$2">
                        {`${shown} av ${total}`}
                    </ThemedText>
                    <ChevronDown size="$3" />
                </ThemedXStack>
            </Animated.View>
        );
    }
);
BottomMoreHint.displayName = 'BottomMoreHint';
