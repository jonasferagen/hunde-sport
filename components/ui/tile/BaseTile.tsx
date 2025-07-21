import { useThemeContext } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { rgba } from "@/utils/helpers";
import { LinearGradient } from 'expo-linear-gradient';
import { DimensionValue, ImageBackground, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { CustomText } from '../text/CustomText';

export interface BaseTileProps {
    name: string;
    imageUrl: string;
    topRightText?: string;
    width?: DimensionValue;
    height?: DimensionValue;
    aspectRatio?: number;
    onPress?: () => void;
    nameNumberOfLines?: number;
    gradientMinHeight?: number;
    themeVariant?: string;
    mainColor?: string;
    textSize?: string;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
}

export const BaseTile = ({
    name,
    imageUrl,
    topRightText,
    width = '100%',
    height,
    aspectRatio,
    onPress,
    nameNumberOfLines = 1,
    gradientMinHeight = 40,
    themeVariant = 'card',
    textSize = 'sm',
    style }: BaseTileProps) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant(themeVariant as any);

    const finalMainColor = theme.backgroundColor;
    const finalTextColor = theme.text.primary;

    if (!imageUrl) {
        return null;
    }

    const dynamicStyle: StyleProp<ViewStyle> = {
        width,
        height: aspectRatio ? undefined : height || '100%',
        aspectRatio,
    };

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, dynamicStyle, style]}>
            <ImageBackground
                source={{ uri: imageUrl }}
                style={styles.imageBackground}
                imageStyle={styles.imageStyle}
            >
                {topRightText && (
                    <View style={[styles.topRightContainer, { backgroundColor: finalMainColor }]}>
                        <CustomText fontSize="sm" style={{ color: finalTextColor }}>{topRightText}</CustomText>
                    </View>
                )}
                <LinearGradient
                    colors={[rgba(finalMainColor, .7), rgba(finalMainColor, 1)]}
                    style={[styles.gradient, { minHeight: gradientMinHeight }]}
                >
                    <CustomText fontSize={textSize as any} style={[styles.name, { color: finalTextColor }]} numberOfLines={nameNumberOfLines}>{name}</CustomText>
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
        textAlign: 'center',
    },
});
