import { ChevronDown } from '@tamagui/lucide-icons';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const AnimatedListExpansionIcon = ({ expanded, size }: { expanded: boolean, size: string }) => {
    const rotation = useSharedValue(expanded ? 180 : 0);

    useEffect(() => {
        rotation.value = withTiming(expanded ? 180 : 0, { duration: 150 });
    }, [expanded]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }));

    return (
        <Animated.View style={animatedStyle}>
            <ChevronDown size={size} />
        </Animated.View>
    );
};