import { JSX, useState } from 'react';
import { Image, ImageProps, StackProps, YStack } from 'tamagui';

export interface FadeInImageProps extends StackProps {
    source: ImageProps['source'];
    objectFit?: ImageProps['objectFit'];
}

export const FadeInImage = ({ source, objectFit, ...stackProps }: FadeInImageProps): JSX.Element => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <YStack
            {...stackProps}
            animation="slow"
            opacity={isLoaded ? 1 : 0}
        >
            <Image
                f={1}
                w="100%"
                h="100%"
                source={source}
                objectFit={objectFit}
                onLoad={() => setIsLoaded(true)}
                onLoadStart={() => setIsLoaded(false)}
            />
        </YStack>
    );
};
