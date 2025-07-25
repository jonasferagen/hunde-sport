import { useProductContext } from '@/contexts';
import { Galeria } from '@nandorojo/galeria';
import React from 'react';
import { Image, YStack } from 'tamagui';

export const ProductImageGallery = () => {
    const { product } = useProductContext();

    if (product.images.length <= 1) {
        return null;
    }

    const urls = product.images.map((image) => image.src);



    return <YStack borderColor="red" borderWidth={1} height={200} flex={1}>
        <Galeria urls={urls}>
            {urls.map((url, index) => (
                <Galeria.Image index={index} key={url + index}>
                    <Image source={{ uri: url }} style={{ height: '100%', width: '100%' }} />
                </Galeria.Image>
            ))}
        </Galeria>
    </YStack>;

};
