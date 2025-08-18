// TileSquare.tsx
import { StoreImage } from '@/domain/StoreImage';
import { getScaledImageUrl } from '@/lib/helpers';
import React, { useMemo } from 'react';
import { PixelRatio } from 'react-native';
import { YStackProps } from 'tamagui';
import { ThemedText, ThemedYStack } from '../themed-components';
import { ThemedImage } from '../themed-components/ThemedImage';
import { ThemedLinearGradient } from '../themed-components/ThemedLinearGradient';
import { ThemedSurface } from '../themed-components/ThemedSurface';
type TileSquareProps = YStackProps & {
    title: string;
    image: StoreImage;
    /** Approx pixel width to request from CDN; avoids onLayout. */
    approxW?: number;        // e.g. pass columnWidthPx if you have it
    showGradient?: boolean;
    titleLines?: number;
};

export const TileSquare = React.memo(function TileSquare({
    title,
    image,
    approxW = 200, // safe default; CDN can upscale/downscale
    children,
    showGradient = true,
    titleLines = 2,
    ...props
}: TileSquareProps) {
    // Ask your scaler for a square; skip measuring


    const dpr = Math.min(PixelRatio.get(), 2);
    const approxPx = Math.round(approxW * dpr);

    const uri = useMemo(
        () => getScaledImageUrl(image.src, approxPx, approxPx),
        [image.src, approxPx]
    );

    return (
        <ThemedSurface f={1} w="100%" h="100%" ov="hidden" bw={2} {...props}>
            {/* Parent wrapper provides aspectRatio=1; do not add another */}
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
