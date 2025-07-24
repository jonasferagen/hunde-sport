import { useProductContext } from '@/contexts';
import { Image } from '@/types';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import ImageViewing from 'react-native-image-viewing';

interface ProductImageContextType {
    openImageViewer: (index: number) => void;
}

const ProductImageContext = createContext<ProductImageContextType | undefined>(undefined);

export const useProductImage = () => {
    const context = useContext(ProductImageContext);
    if (!context) {
        throw new Error('useProductImage must be used within a ProductImageProvider');
    }
    return context;
};

interface ProductImageProviderProps {
    children: ReactNode;
}

export const ProductImageProvider = ({ children }: ProductImageProviderProps) => {
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
        return <>{children}</>; // Render children even if there are no images
    }

    const galleryImages = product.images.map((img: Image) => ({ uri: img.src }));

    return (
        <ProductImageContext.Provider value={{ openImageViewer }}>
            {children}
            <ImageViewing
                images={galleryImages}
                imageIndex={currentImageIndex}
                visible={isImageViewerVisible}
                onRequestClose={closeImageViewer}
                animationType="slide"
            />
        </ProductImageContext.Provider>
    );
};
