import { StoreImage } from '@/domain/StoreImage';
import { getAspectRatio, getScaledImageUrl } from '@/lib/helpers';
import { JSX } from 'react';
import { DimensionValue } from 'react-native';
import { YStack, YStackProps } from 'tamagui';
import { ThemedText, ThemedYStack } from '../themed-components';
import { ThemedImage } from '../themed-components/ThemedImage';
import { ThemedLinearGradient } from '../themed-components/ThemedLinearGradient';
import { ThemedSurface } from '../themed-components/ThemedSurface';

export interface TileProps extends YStackProps {
    title: string;
    image: StoreImage;
}

export const Tile = ({
    title,
    image,
    children,
    ...props
}: TileProps): JSX.Element => {


    const aspectRatio = getAspectRatio(props.w as DimensionValue, props.h as DimensionValue);
    const uri = getScaledImageUrl(image.src, props.w as DimensionValue, props.h as DimensionValue);

    return (
        <ThemedSurface
            bw={2}
            pressStyle={{ boc: '$borderColorInverse', bg: '$backgroundInverse' }}
            {...props}
            ov="hidden"
        >
            <ThemedYStack fullscreen aspectRatio={aspectRatio} >
                <ThemedImage uri={uri} title={title} aspectRatio={aspectRatio} />
                {children}
                <ThemedYStack fullscreen f={1} t="auto" p="$2.5" jc="flex-end">
                    <ThemedLinearGradient fullscreen start={[0, 0.2]} end={[0, 0.9]} opacity={0.8} />
                    <ThemedText bold col="$color" numberOfLines={2} ellipse ta="center">
                        {title}
                    </ThemedText>
                </ThemedYStack>
            </ThemedYStack>
        </ThemedSurface >
    );
};

interface TileBadgeProps extends YStackProps { }

export const TileBadge = ({ children, ...props }: TileBadgeProps): JSX.Element => {
    return (
        <YStack
            pos="absolute"
            t="$2"
            r="$2"

            {...props}
        >
            {children}
        </YStack>
    );
};


