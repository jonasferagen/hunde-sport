// TileFixed.tsx
import { StoreImage } from '@/domain/StoreImage';
import { getScaledImageUrl } from '@/lib/helpers';
import React, { useMemo } from 'react';
import { DimensionValue } from 'react-native';
import { YStackProps } from 'tamagui';
import { ThemedText, ThemedYStack } from '../themed-components';
import { ThemedImage } from '../themed-components/ThemedImage';
import { ThemedLinearGradient } from '../themed-components/ThemedLinearGradient';
import { ThemedSurface } from '../themed-components/ThemedSurface';

type TileFixedProps = YStackProps & {
    title: string;
    image: StoreImage;
    w: number;                   // explicit px
    h: number;                   // explicit px
    showGradient?: boolean;
    titleLines?: number;
};

export const TileFixed = React.memo(function TileFixed({
    title,
    image,
    w,
    h,
    children,
    showGradient = true,
    titleLines = 2,
    ...props
}: TileFixedProps) {
    const uri = useMemo(
        () => getScaledImageUrl(image.src, w as DimensionValue, h as DimensionValue),
        [image.src, w, h]
    );

    return (
        <ThemedSurface
            w={w}
            h={h}
            ov="hidden"
            bw={2}
            pressStyle={{ boc: '$borderColorInverse', bg: '$backgroundInverse' }}
            {...props}
        >
            {/* No aspectRatio here; fixed box avoids measurement */}
            <ThemedYStack fullscreen>
                <ThemedImage uri={uri} title={title} contentFit="cover" />
                {children}
                {showGradient && (
                    <ThemedYStack fullscreen t="auto" p="$2.5" jc="flex-end">
                        <ThemedLinearGradient fullscreen start={[0, 0.2]} end={[0, 0.9]} opacity={0.8} />
                        <ThemedText bold col="$color" numberOfLines={titleLines} ellipse ta="center">
                            {title}
                        </ThemedText>
                    </ThemedYStack>
                )}
            </ThemedYStack>
        </ThemedSurface>
    );
});
