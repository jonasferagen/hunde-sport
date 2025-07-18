import { useThemeContext } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { IStyleVariant, Image as ProductImage } from '@/types';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface ProductImageGalleryProps {
    images: ProductImage[];
    onImagePress: (index: number) => void;
}

export const ProductImageGallery = ({
    images,
    onImagePress,
}: ProductImageGalleryProps) => {
    const { themeManager } = useThemeContext();
    const themeVariant = themeManager.getVariant('default');
    const styles = createStyles(themeVariant);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <View style={styles.imageGalleryContainer}>
            {images.map((image, index) => (
                <View key={'imageGalleryItem-' + index} style={styles.imageThumbnailWrapper}>
                    <TouchableOpacity onPress={() => onImagePress(index)}>
                        <Image source={{ uri: image.src }} style={styles.imageThumbnail} />
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const createStyles = (themeVariant: IStyleVariant) =>
    StyleSheet.create({
        imageGalleryContainer: {
            flexDirection: 'row',
            gap: SPACING.sm,
        },
        imageThumbnailWrapper: {
            width: 100, // Creates a 3-column grid with spacing
            height: 100,
            borderRadius: BORDER_RADIUS.sm,
            borderWidth: 1,
            borderColor: themeVariant.borderColor,
            overflow: 'hidden', // Ensures the image respects the border radius
        },
        imageThumbnail: {
            height: '100%',
            width: '100%',
        },
    });
