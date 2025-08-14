import { getAspectRatio } from '@/lib/helpers';
import { StoreImage } from '@/models/StoreImage';
import { JSX } from 'react';
import { DimensionValue } from 'react-native';
import { SizableText, YStack, YStackProps } from 'tamagui';
import { ThemedYStack } from '../themed-components';
import { ThemedImage } from '../themed-components/ThemedImage';
import { ThemedLinearGradient } from '../themed-components/ThemedLinearGradient';

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

    return (

        <ThemedYStack
            box
            rounded
            ov="hidden"
            aspectRatio={aspectRatio}
            {...props}
        >
            <ThemedImage
                fullscreen
                image={image}
                title={title}
            />
            {children}
            <YStack fullscreen t="auto" p="$2.5" jc="flex-end" f={1}>
                <ThemedLinearGradient
                    fullscreen
                    flip
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
        </ThemedYStack>

    );
};

interface TileBadgeProps extends YStackProps { }

export const TileBadge = ({ children, ...props }: TileBadgeProps): JSX.Element => {
    return (
        <YStack
            pos="absolute"
            t="$1"
            r="$1"

            {...props}
        >
            {children}
        </YStack>
    );
};
