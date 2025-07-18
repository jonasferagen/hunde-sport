import { useTheme } from '@/contexts';
import { BORDER_RADIUS } from '@/styles';
import { Image as ProductImageType, StyleVariant } from '@/types';
import { getScaledImageUrl } from '@/utils/helpers';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ProductImageProps {
    image: ProductImageType;
    onPress: () => void;
}

const IMAGE_HEIGHT = 300;


export const ProductImage = ({ image, onPress }: ProductImageProps) => {
    const { themeManager } = useTheme();
    const themeVariant = themeManager.getVariant('default');
    const styles = createStyles(themeVariant);
    const imageUrl = getScaledImageUrl(image.src, IMAGE_HEIGHT, IMAGE_HEIGHT);

    return (
        <View style={styles.mainImageWrapper}>
            <TouchableOpacity onPress={onPress}>
                <Image source={{ uri: imageUrl }} style={styles.mainImage} />
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (themeVariant: StyleVariant) =>
    StyleSheet.create({
        mainImageWrapper: {
            width: '100%',
            height: IMAGE_HEIGHT,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: themeVariant.borderColor,
            borderRadius: BORDER_RADIUS.md,
        },
        mainImage: {
            height: '100%',
            width: '100%',
        },
    });
