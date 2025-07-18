import { ProductImage } from '@/components/features/product/ProductImage';
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery';
import { PageContent } from '@/components/layout';
import { Product } from '@/types';
import React, { useState } from 'react';
import ImageViewing from 'react-native-image-viewing';

interface ProductImageManagerProps {
    product: Product;
}

export const ProductImageManager = ({ product }: ProductImageManagerProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageViewerVisible, setImageViewerVisible] = useState(false);

    const openImageViewer = (index: number) => {
        setCurrentImageIndex(index);
        setImageViewerVisible(true);
    };

    const closeImageViewer = () => {
        setImageViewerVisible(false);
    };

    if (!product.images || product.images.length === 0) {
        return null; // Or a placeholder
    }

    const galleryImages = product.images.map(img => ({ uri: img.src }));

    return (
        <>

            <ProductImage image={product.images[0]} onPress={() => openImageViewer(0)} />


            {product.images.length > 1 && (
                <PageContent horizontal secondary title="Bilder">
                    <ProductImageGallery
                        images={product.images}
                        onImagePress={openImageViewer}
                    />
                </PageContent>
            )}

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
