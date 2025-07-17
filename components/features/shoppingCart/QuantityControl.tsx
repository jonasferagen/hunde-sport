import { CustomText, Icon } from '@/components/ui';
import { FONT_SIZES, SPACING } from '@/styles';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

interface QuantityControlProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, onIncrease, onDecrease }) => {
    const animation = useRef(new Animated.Value(quantity > 0 ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: quantity > 0 ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [quantity]);

    const animatedStyle = {
        opacity: animation,
        transform: [
            {
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                }),
            },
        ],
    };

    return (
        <View style={styles.quantityContainer}>
            <Animated.View style={[styles.minusContainer, animatedStyle]} pointerEvents={quantity > 0 ? 'auto' : 'none'}>
                <Pressable onPress={onDecrease} style={styles.quantityButton}>
                    <Icon name="remove" size="xl" color="#888" />
                </Pressable>
                <CustomText style={styles.quantityText}>{quantity}</CustomText>
            </Animated.View>

            <Pressable onPress={onIncrease} style={styles.quantityButton}>
                <Icon name="add" size="xl" color="#007AFF" />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minWidth: 40,
        maxWidth: 100,
        width: 100,
        height: 'auto',
    },
    minusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        padding: SPACING.sm,
    },
    quantityText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
});
