// TileFixed.tsx
import type { StoreImage } from '@/domain/StoreImage';
import { getScaledImageUrl } from '@/lib/helpers';
import { ImageProps } from 'expo-image';
import React from 'react';
import { PixelRatio } from 'react-native';
import type { YStackProps } from 'tamagui';
import { ThemedLinearGradient, ThemedText, ThemedYStack } from '../themed-components';
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
    imagePriority?: ImageProps['priority'];
    interactive?: boolean;
};
// TileFixed.tsx (only one pressable)
export const TileFixed = React.memo(function TileFixed({
    title,
    image,
    w,
    h,
    interactive,
    onPress,
    imagePriority,
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
            interactive={interactive}
            // only attach interactivity when visible:

            onPress={interactive ? onPress : undefined}
            pointerEvents={interactive ? 'auto' : 'none'}

            {...props}
        >
            <ThemedImage
                priority={imagePriority}
                uri={uri}
                title={title}
                contentFit="cover"
                transitionMs={0}
                cachePolicy="memory-disk"
                recyclingKey={uri}
                w="100%"
                h="100%"
                br="$3"
            />
            {/* keep overlays non-blocking */}


            {showGradient && (
                <ThemedYStack fullscreen t="auto" p="$2.5" jc="flex-end">
                    <ThemedLinearGradient fullscreen start={[0, 0.2]} end={[0, 0.9]} opacity={0.8} />
                    <ThemedText bold col="$color" numberOfLines={titleLines} ellipse ta="center">
                        {title}
                    </ThemedText>
                </ThemedYStack>
            )}

            {children}

            {/* title */}
            <ThemedText bold col="$color" numberOfLines={titleLines} ellipse ta="center">
                {title}
            </ThemedText>




        </ThemedSurface>
    );
});
