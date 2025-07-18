import { useStatusContext, useThemeContext } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';

import React, { useEffect, useState, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export const StatusMessage: React.FC = () => {
    const { message, type, elementRef } = useStatusContext();
    const { themeManager } = useThemeContext();
    const [topPosition, setTopPosition] = useState(0);
    const statusRef = useRef<import('react-native').View>(null);

    const alertType = type === 'warning' ? 'info' : type;
    const variant = themeManager.getAlert(alertType);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (message) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            if (elementRef?.current) {
                elementRef.current.measure((_x: number, _y: number, _width: number, height: number, _pageX: number, pageY: number) => {
                    setTopPosition(pageY + height + 5);
                });
            }
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [message, elementRef, fadeAnim]);

    if (!message) {
        return null;
    }

    const containerStyle = {
        opacity: .8,
        backgroundColor: variant.backgroundColor,
        borderColor: variant.borderColor,
        borderWidth: 1,
    };


    return (
        <Animated.View
            ref={statusRef}
            style={[
                styles.statusContainer,
                containerStyle,
                { opacity: fadeAnim, top: topPosition },
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
    },
    text: {
        color: 'white',
        textAlign: 'center',
    },
});
