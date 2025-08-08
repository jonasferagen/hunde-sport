import { Image as ImageModel } from '@/models/Image';
import { MotiView } from 'moti';
import { JSX, useState } from 'react';
import { Image, ImageProps, YStack, YStackProps } from 'tamagui';

export interface ThemedImageProps extends YStackProps {
    source: ImageProps['source'];
    image: ImageModel;
    title?: string;
    objectFit?: ImageProps['objectFit'];
}

export const ThemedImage = ({
    source,
    image,
    title,
    objectFit,
    ...stackProps
}: ThemedImageProps): JSX.Element => {
    const [isLoaded, setIsLoaded] = useState(false);
    const ariaLabel = image?.alt || title;

    return (
        <YStack {...stackProps}>
            <MotiView
                style={{ flex: 1, width: '100%', height: '100%' }}
                pointerEvents={isLoaded ? 'auto' : 'none'}
                animate={{
                    opacity: isLoaded ? 1 : 0,
                }}
                transition={{
                    type: 'timing',
                    duration: 500,
                }}
            >
                <Image
                    f={1}
                    w="100%"
                    h="100%"
                    source={source}
                    objectFit={objectFit}
                    aria-label={ariaLabel}
                    onLoad={() => setIsLoaded(true)}
                    onLoadStart={() => setIsLoaded(false)}
                />
            </MotiView>
        </YStack>
    );
};
