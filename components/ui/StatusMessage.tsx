import { useLayout, useStatus } from '@/hooks';
import { BORDER_RADIUS, COLORS, SPACING } from '@/styles';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const StatusMessage = () => {
    const { message } = useStatus();
    const { bottomMenuHeight } = useLayout();
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: message ? 1 : 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, [message]);

    if (!message) {
        return null;
    }

    return (
        <Animated.View style={[styles.statusContainer, { opacity: fadeAnim, bottom: bottomMenuHeight + SPACING.sm }]}>
            <Text style={styles.statusText}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    statusContainer: {
        borderColor: COLORS.black,
        borderWidth: 1,
        position: 'absolute',
        left: SPACING.md,
        right: SPACING.md,
        backgroundColor: COLORS.backgroundPrimary,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        color: COLORS.text,
        fontWeight: 'bold',
    },
});

export default StatusMessage;
