import { useTheme } from '@/contexts';
import { BORDER_RADIUS } from '@/styles';
import { Theme } from '@/styles/Theme';
import { Image as ProductImageType } from '@/types';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ProductImageProps {
    image: ProductImageType;
    onPress: () => void;
}

export const ProductImage = ({ image, onPress }: ProductImageProps) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.mainImageWrapper}>
            <TouchableOpacity onPress={onPress}>
                <Image source={{ uri: image.src }} style={styles.mainImage} />
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        mainImageWrapper: {
            width: '100%',
            height: 300,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: BORDER_RADIUS.md,
        },
        mainImage: {
            height: '100%',
            width: '100%',
        },
    });
