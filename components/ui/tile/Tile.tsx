import { Image } from '@/models/Image';
import { getScaledImageUrl } from '@/utils/helpers';
import { JSX } from 'react';
import { SizableText, YStack, YStackProps } from 'tamagui';
import { ThemedImage } from '../ThemedImage';
import { ThemedLinearGradient } from '../ThemedLinearGradient';

export interface TileProps extends YStackProps {
    title: string;
    image: Image;
}

export const Tile = ({
    title,
    image,
    children,
    aspectRatio = 1,
    ...props
}: TileProps): JSX.Element => {
    const uri = getScaledImageUrl(image.src, props.w, props.h, 'cover');

    return (
        <YStack
            br="$4"
            overflow="hidden"
            aspectRatio={aspectRatio}
            {...props}
        >
            <ThemedImage
                pos="absolute"
                t={0}
                l={0}
                r={0}
                b={0}
                source={{ uri }}
                aria-label={image.alt || title}
            />

            {children}

            <YStack pos="absolute" b={0} l={0} r={0} p="$2.5" jc="flex-end" f={1}>
                <ThemedLinearGradient
                    pos="absolute"
                    t={0}
                    l={0}
                    r={0}
                    b={0}
                    colors={['$backgroundTransparent', '$background']}
                    start={[0, 0.2]}
                    end={[0, 0.9]}
                    opacity={0.8}
                />
                <SizableText
                    fos="$5"
                    fow="bold"
                    col="$color"
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    ellipse
                >
                    {title}
                </SizableText>
            </YStack>
        </YStack>
    );
};

interface TileBadgeProps extends YStackProps { }

export const TileBadge = ({ children, ...props }: TileBadgeProps): JSX.Element => {
    return (
        <YStack
            pos="absolute"
            t="$2"
            r="$2"
            px="$2"
            py="$1"
            br="$10"
            bg="$backgroundStrong"
            elevation="$2"
            {...props}
        >
            {children}
        </YStack>
    );
};
