import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import { MotiView } from 'moti';
import { JSX, useState } from 'react';
import { DimensionValue } from 'react-native';
import { Image, ImageProps, YStackProps, ZStack } from 'tamagui';

export interface ThemedImageProps extends YStackProps {

    title?: string;
    objectFit?: ImageProps['objectFit'];
    aspectRatio?: number;
    w?: DimensionValue;
    h?: DimensionValue;
    uri: string;
}

export const ThemedImage = ({

    title,
    uri,
    objectFit,
    aspectRatio,
    w = '100%',
    h = '100%',
    ...props
}: ThemedImageProps): JSX.Element => {
    const [loading, setLoading] = useState(true);



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
                    aria-label={title}
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
