import { getScaledImageUrl } from '@/lib/helpers';
import { StoreImage as ImageModel } from '@/models/StoreImage';
import { MotiView } from 'moti';
import { JSX, useState } from 'react';
import { DimensionValue } from 'react-native';
import { Image, ImageProps, YStack, YStackProps } from 'tamagui';

export interface ThemedImageProps extends YStackProps {
    image: ImageModel;
    title?: string;
    objectFit?: ImageProps['objectFit'];
    aspectRatio?: number;
    w?: DimensionValue;
    h: DimensionValue;
}

export const ThemedImage = ({
    image,
    title,
    objectFit,
    aspectRatio,
    w = '100%',
    h = '100%',
    ...props
}: ThemedImageProps): JSX.Element => {
    const [isLoaded, setIsLoaded] = useState(false);
    const ariaLabel = image?.alt || title;
    const uri = getScaledImageUrl(image.src, w, h);

    return (
        <YStack {...props}>
            <MotiView
                style={{ width: '100%', height: '100%' }}
                pointerEvents={isLoaded ? 'auto' : 'none'}
                animate={{
                    opacity: isLoaded ? 1 : 0,
                }}
                transition={{
                    type: 'timing',
                    duration: 200,
                }}
            >
                <Image
                    w="100%"
                    source={{ uri }}
                    objectFit={objectFit}
                    aria-label={ariaLabel}
                    aspectRatio={aspectRatio}
                    h={aspectRatio ? undefined : '100%'}
                    onLoad={() => setIsLoaded(true)}
                    onLoadStart={() => setIsLoaded(false)}
                />
            </MotiView>
        </YStack>
    );
};
