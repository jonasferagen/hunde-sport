import { ChevronRight } from '@tamagui/lucide-icons';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const AnimatedListExpansionIcon = ({ expanded, size }: { expanded: boolean, size: string }) => {
    const rotation = useSharedValue(expanded ? 90 : 0);

    useEffect(() => {
        rotation.value = withTiming(expanded ? 90 : 0, { duration: 150 });
    }, [expanded]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <ChevronRight size={size} />
        </Animated.View>
    );
};