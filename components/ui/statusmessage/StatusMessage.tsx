import { useStatusContext, useThemeContext } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

export const StatusMessage: React.FC = () => {
    const { message, type, elementRef } = useStatusContext();
    const { themeManager } = useThemeContext();

    const opacity = useSharedValue(0);
    const top = useSharedValue(0);

    const alertType = type === 'warning' ? 'info' : type;
    const variant = themeManager.getAlert(alertType);

    useEffect(() => {
        if (message) {
            opacity.value = withTiming(1, { duration: 300 });

            if (elementRef?.current) {
                // Use measure to position the status message below the triggering element
                elementRef.current.measure(
                    (_x: number, _y: number, _width: number, height: number, _pageX: number, pageY: number) => {
                        top.value = pageY + height + SPACING.sm;
                    }
                );
            }
        } else {
            opacity.value = withTiming(0, { duration: 300 });
        }
    }, [message, elementRef, opacity, top]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            top: top.value,
        };
    });

    if (!message) {
        return null;
    }

    const containerStyle = {
        backgroundColor: variant.backgroundColor,
        borderColor: variant.borderColor,
        borderWidth: 1,
    };

    return (
        <Animated.View
            style={[
                styles.statusContainer,
                containerStyle,
                animatedStyle,
            ]}
        >
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    statusContainer: {
        position: 'absolute',
        left: SPACING.md,
        right: SPACING.md,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        zIndex: 1000, // Ensure it's on top
        opacity: 0.8, // Set base opacity here
    },
    text: {
        color: 'white',
        textAlign: 'center',
    },
});
