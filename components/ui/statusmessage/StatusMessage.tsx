import { useLayout, useStatus } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

// Define colors locally to avoid theme dependency issues during startup
const statusColors = {
    info: '#1976D2', // Blue
    success: '#388E3C', // Green
};

const StatusMessage = () => {
    const { message, type } = useStatus();
    const { bottomMenuHeight } = useLayout();
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
        backgroundColor: statusColors[type] || statusColors.info,
    };

    return (
        <Animated.View
            style={[
                styles.statusContainer,
                containerStyle,
                { opacity: fadeAnim, bottom: bottomMenuHeight + SPACING.sm },
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
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default StatusMessage;
