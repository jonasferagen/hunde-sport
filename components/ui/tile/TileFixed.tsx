// TileFixed.tsx
import type { StoreImage } from '@/domain/StoreImage';
import { getScaledImageUrl } from '@/lib/helpers';
import React from 'react';
import { PixelRatio } from 'react-native';
import type { YStackProps } from 'tamagui';
import { ThemedImage } from '../themed-components/ThemedImage';
import { ThemedSurface } from '../themed-components/ThemedSurface';

type TileFixedProps = YStackProps & {
    title: string;
    image: StoreImage;
    w: number;              // px
    h: number;              // px
    onPress?: () => void;
    showGradient?: boolean;
    titleLines?: number;
};
// TileFixed.tsx (only one pressable)
export const TileFixed = React.memo(function TileFixed({
    title,
    image,
    w,
    h,
    onPress,
    showGradient = true,
    titleLines = 2,
    children,
    ...props
}: TileFixedProps) {
    const dpr = Math.min(PixelRatio.get(), 2); // crisper thumbs
    const uri = React.useMemo(
        () => getScaledImageUrl(image.src, Math.round(w * dpr), Math.round(h * dpr)),
        [image.src, w, h, dpr]
    );

    return (
        <ThemedSurface
            w={w}
            h={h}
            ov="hidden"
            bw={2}
            onPress={onPress}                         // <-- move onPress here
            pressStyle={{ boc: '$borderColorInverse', bg: '$backgroundInverse' }}
            {...props}
        >
            <ThemedImage
                uri={uri}
                title={title}
                contentFit="cover"
                transitionMs={0}
                cachePolicy="memory-disk"
                recyclingKey={uri}
                w="100%"
                h="100%"
                borderRadiusPx={8}
            />

            {children}

            {/* keep overlays non-blocking */}
            {/* <ThemedLinearGradient pointerEvents="none" ... /> */}

            {/* title */}
            {/* ... */}
        </ThemedSurface>
    );
});
