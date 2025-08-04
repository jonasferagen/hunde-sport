import { MotiView } from 'moti';
import { JSX, useState } from 'react';
import { Image, ImageProps, YStack, YStackProps } from 'tamagui';

export interface FadeInImageProps extends YStackProps {
    source: ImageProps['source'];
    objectFit?: ImageProps['objectFit'];
}

export const FadeInImage = ({ source, objectFit, ...stackProps }: FadeInImageProps): JSX.Element => {
    const [isLoaded, setIsLoaded] = useState(false);

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
                    onLoad={() => setIsLoaded(true)}
                    onLoadStart={() => setIsLoaded(false)}
                />
            </MotiView>
        </YStack>
    );
};
