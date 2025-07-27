import { useStatusContext } from '@/contexts';
import React, { useEffect } from 'react';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { SizableText, YStack } from 'tamagui';

const AnimatedYStack = Animated.createAnimatedComponent(YStack);

export const StatusMessage: React.FC = () => {
    const { message, type, elementRef } = useStatusContext();

    const opacity = useSharedValue(0);
    const top = useSharedValue(0);

    useEffect(() => {
        if (message) {
            opacity.value = withTiming(1, { duration: 300 });

            if (elementRef?.current) {
                elementRef.current.measure(
                    (_x: number, _y: number, _width: number, height: number, _pageX: number, pageY: number) => {
                        top.value = pageY + height + 10; // Corresponds to space.sm
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

    const getThemeProps = () => {
        switch (type) {
            case 'success':
                return { backgroundColor: '$green8', borderColor: '$green10' };
            case 'warning':
            case 'info':
                return { backgroundColor: '$background', borderColor: '$borderColor' };
            default:
                return { backgroundColor: '$background', borderColor: '$borderColor' };
        }
    };

    return (
        <AnimatedYStack
            theme="accent"
            position="absolute"
            left="$space.2"
            right="$space.2"
            padding="$space.3"
            borderRadius="$4"
            zIndex={1000}
            borderWidth={1}
            {...getThemeProps()}
            style={animatedStyle}
        >
            <SizableText color="$color.white" textAlign="center" fontWeight="bold">
                {message}
            </SizableText>
        </AnimatedYStack>
    );
};
