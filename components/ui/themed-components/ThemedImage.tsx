import { getScaledImageUrl } from '@/lib/helpers';
import { StoreImage as ImageModel } from '@/models/StoreImage';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import { MotiView } from 'moti';
import { JSX, useState } from 'react';
import { DimensionValue } from 'react-native';
import { Image, ImageProps, YStackProps, ZStack } from 'tamagui';

export interface ThemedImageProps extends YStackProps {
    image: ImageModel;
    title?: string;
    objectFit?: ImageProps['objectFit'];
    aspectRatio?: number;
    w?: DimensionValue;
    h?: DimensionValue;
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
    const [loading, setLoading] = useState(true);

    const ariaLabel = image?.alt || title;
    const uri = getScaledImageUrl(image.src, w, h, 'cover');

    return (
        <ZStack w={w} h={h} ai="center" jc="center" {...props}>
            {/* Image layer (fades in) */}
            <MotiView
                style={{ width: '100%', height: '100%' }}
                animate={{ opacity: loading ? 0 : 1 }}
                transition={{ type: 'timing', duration: 200 }}
                pointerEvents={loading ? 'none' : 'auto'}
            >
                <Image
                    w="100%"
                    source={{ uri }}
                    objectFit={objectFit}
                    aria-label={ariaLabel}
                    aspectRatio={aspectRatio}
                    h={aspectRatio ? undefined : '100%'}
                    onLoadStart={() => {
                        setLoading(true);
                    }}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setLoading(false);
                    }}
                />
            </MotiView>

            {loading && <LoadingScreen />}


        </ZStack>
    );
};
