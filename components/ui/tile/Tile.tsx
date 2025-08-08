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
            ov="hidden"
            aspectRatio={aspectRatio}
            {...props}
        >
            <ThemedImage
                fullscreen
                source={{ uri }}
                image={image}
                title={title}

            />

            {children}

            <YStack fullscreen t="auto" p="$2.5" jc="flex-end" f={1}>
                <ThemedLinearGradient
                    fullscreen
                    colors={['$backgroundPress', '$background']}
                    start={[0, 0.2]}
                    end={[0, 0.9]}
                    opacity={0.8}
                />
                <SizableText
                    fos="$3"
                    fow="bold"
                    col="$color"
                    numberOfLines={2}
                    ellipse
                    ta="center"
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
            br="$2"
            bg="$backgroundStrong"
            elevation="$2"
            {...props}
        >
            {children}
        </YStack>
    );
};
