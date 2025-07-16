// components/layout/Sidebar.tsx
import { useLayout, useTheme } from '@/contexts';
import { SPACING } from '@/styles';
import { Theme } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { CategoryTree } from '../features/category';
import { CustomText } from '../ui';

interface SidebarProps {
    style?: ViewStyle;
}

export const Sidebar = ({ style }: SidebarProps) => {

    const { width, height } = useWindowDimensions();
    const { theme } = useTheme();
    const { isSidebarVisible, bottomMenuHeight, insets } = useLayout();
    const styles = createStyles(theme);

    const sidebarWidth = width * 0.9;
    const duration = 300;

    const translateX = useSharedValue(-sidebarWidth); // Initial position off-screen
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateX.value = withTiming(isSidebarVisible ? 0 : -sidebarWidth, { duration });
        opacity.value = withTiming(isSidebarVisible ? 1 : 0, { duration });
    }, [isSidebarVisible, translateX, opacity, sidebarWidth]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
            opacity: opacity.value,
        };
    });

    console.log(SPACING.md);

    return (
        <Animated.View style={[
            styles.container,
            { bottom: bottomMenuHeight, width: sidebarWidth },
            style,
            animatedStyle
        ]} onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            console.log('sidebar height is', height);
        }}>
            <LinearGradient
                colors={theme.gradients.primary}
                style={styles.content}
            ><View style={styles.header}>
                    <CustomText>Produkter</CustomText>
                </View>
                <ScrollView>
                    <CategoryTree />
                    <CategoryTree />
                    <CategoryTree />
                </ScrollView>
            </LinearGradient>
        </Animated.View>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100, // Ensure sidebar is on top

    },
    content: {
        padding: SPACING.md,
        height: '100%',
        borderRightWidth: 1,
        borderRightColor: theme.gradients.primary[1],
    },
    header: {
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.gradients.primary[1],
    }
});