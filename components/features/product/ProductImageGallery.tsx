import { useTheme } from '@/contexts';
import { BORDER_RADIUS, SPACING } from '@/styles';
import { Image as ProductImage, StyleVariant } from '@/types';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

interface ProductImageGalleryProps {
    images: ProductImage[];
    onImagePress: (index: number) => void;
    isImageViewerVisible: boolean;
    closeImageViewer: () => void;
    currentImageIndex: number;
}

export const ProductImageGallery = ({
    images,
    onImagePress,
    isImageViewerVisible,
    closeImageViewer,
    currentImageIndex,
}: ProductImageGalleryProps) => {
    const { themeManager } = useTheme();
    const themeVariant = themeManager.getVariant('default');
    const styles = createStyles(themeVariant);

    if (!images || images.length === 0) {
        return null;
    }

    const galleryImages = images.map(img => ({ uri: img.src }));

    return (
        <>
            <View style={styles.imageGalleryContainer}>
                {images.map((image, index) => (
                    <View key={'imageGalleryItem-' + index} style={styles.imageThumbnailWrapper}>
                        <TouchableOpacity onPress={() => onImagePress(index)}>
                            <Image source={{ uri: image.src }} style={styles.imageThumbnail} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <ImageViewing
                images={galleryImages}
                imageIndex={currentImageIndex}
                visible={isImageViewerVisible}
                onRequestClose={closeImageViewer}
                animationType="slide"
            />
        </>
    );
};

const createStyles = (themeVariant: StyleVariant) =>
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
