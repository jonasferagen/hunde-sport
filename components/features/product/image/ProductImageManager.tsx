import { PageContent } from '@/components/layout';
import { useProductContext } from '@/contexts';
import React, { useState } from 'react';
import ImageViewing from 'react-native-image-viewing';
import { ProductImage } from './ProductImage';
import { ProductImageGallery } from './ProductImageGallery';

export const ProductImageManager = () => {
    const { product } = useProductContext();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageViewerVisible, setImageViewerVisible] = useState(false);

    const openImageViewer = (index: number) => {
        setCurrentImageIndex(index);
        setImageViewerVisible(true);
    };

    const closeImageViewer = () => {
        setImageViewerVisible(false);
    };

    if (!product || !product.images || product.images.length === 0) {
        return null; // Or a placeholder
    }

    const galleryImages = product.images.map((img) => ({ uri: img.src }));

    return (
        <>
            <ProductImage onPress={() => openImageViewer(0)} />

            <PageContent title="Flere bilder" horizontal>
                <ProductImageGallery onImagePress={(index) => openImageViewer(index + 1)} />
            </PageContent>

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
