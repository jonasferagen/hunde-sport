import { useThemeContext } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { rgba } from "@/utils/helpers";
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { DimensionValue, ImageBackground, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import { CustomText } from '../text/CustomText';

export interface BaseTileProps {
    name: string;
    imageUrl: string;
    topRightComponent?: React.ReactNode;
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
    topRightComponent,
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

    const styles = createStyles(theme);

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
                {topRightComponent && (
                    <View style={styles.topRightContainer}>
                        {topRightComponent}
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

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'black'
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
