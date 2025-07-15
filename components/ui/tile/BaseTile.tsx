import { BORDER_RADIUS, COLORS, SPACING } from '@/styles';
import { rgba } from "@/utils/helpers";
import { LinearGradient } from 'expo-linear-gradient';
import { DimensionValue, ImageBackground, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { CustomText } from '../customtext/CustomText';

export interface BaseTileProps {
    name: string;
    imageUrl: string;
    topRightText?: string;
    width?: DimensionValue;
    height?: DimensionValue;
    onPress?: () => void;
    nameNumberOfLines?: number;
    gradientMinHeight?: number;
    mainColor?: string;
    style?: StyleProp<ViewStyle>;
}

export const BaseTile = ({
    name,
    imageUrl,
    topRightText,
    width = '100%',
    height = '100%',
    onPress,
    nameNumberOfLines = 1,
    gradientMinHeight = 40,
    mainColor = COLORS.secondary,
    style }: BaseTileProps) => {

    if (!imageUrl) {
        return null;
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, { width, height }, style]}>
            <ImageBackground
                source={{ uri: imageUrl }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
            >
                {topRightText && (
                    <View style={[styles.topRightContainer, { backgroundColor: mainColor }]}>
                        <CustomText size="sm" style={styles.topRightText}>{topRightText}</CustomText>
                    </View>
                )}
                <LinearGradient
                    colors={[rgba(mainColor, .7), rgba(mainColor, 1)]}
                    style={[styles.gradient, { minHeight: gradientMinHeight }]}
                >
                    <CustomText size="sm" style={styles.name} numberOfLines={nameNumberOfLines}>{name}</CustomText>
                </LinearGradient>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        marginRight: SPACING.sm,
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    topRightContainer: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        alignSelf: 'flex-end',
        opacity: 0.9,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
    },
    topRightText: {
        color: 'white',
    },
    imageStyle: {
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.sm,
    },
    name: {
        color: 'white',
        textAlign: 'center',
    },
});
