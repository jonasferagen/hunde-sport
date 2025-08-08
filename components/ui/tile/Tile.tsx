import { getAspectRatio, getScaledImageUrl } from '@/lib/helpers';
import { StoreImage } from '@/models/StoreImage';
import { JSX } from 'react';
import { DimensionValue } from 'react-native';
import { SizableText, YStack, YStackProps } from 'tamagui';
import { ThemedImage } from '../ThemedImage';
import { ThemedLinearGradient } from '../ThemedLinearGradient';

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
    const uri = getScaledImageUrl(image.src, props.w as DimensionValue, props.h as DimensionValue, 'cover');

    return (
        <YStack
            br="$4"
            ov="hidden"
            aspectRatio={aspectRatio}
            boc="$borderColor"
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
                    startPoint={[0, 0.2]}
                    endPoint={[0, 0.9]}
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
