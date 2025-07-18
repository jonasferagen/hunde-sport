import { useStatus, useTheme } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';

import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export const StatusMessage = () => {
    const { message, type, elementRef } = useStatus();
    const { themeManager } = useTheme();
    const variant = themeManager.getAlert(type);
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: message ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [message]);

    if (!message) {
        return null;
    }

    const containerStyle = {
        opacity: .8,
        backgroundColor: variant.backgroundColor,
        borderColor: variant.borderColor,
        borderWidth: 1,
    };

    console.log(elementRef);

    return (
        <Animated.View
            style={[
                styles.statusContainer,
                containerStyle,
                { opacity: fadeAnim, top: elementRef?.current?.offsetTop },
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
