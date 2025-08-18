// TileFixed.tsx
import type { StoreImage } from '@/domain/StoreImage';
import { getScaledImageUrl } from '@/lib/helpers';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { YStackProps } from 'tamagui';
import { ThemedText } from '../themed-components';
import { ThemedImage } from '../themed-components/ThemedImage';
import { ThemedLinearGradient } from '../themed-components/ThemedLinearGradient';
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
    // Ask CDN for exact size; no measuring needed
    const uri = React.useMemo(() => getScaledImageUrl(image.src, w, h), [image.src, w, h]);

    const content = (
        <ThemedSurface
            w={w}
            h={h}
            ov="hidden"                 // keep if you rely on clipping; else remove for Android perf
            bw={2}
            pressStyle={{ boc: '$borderColorInverse', bg: '$backgroundInverse' }}
            {...props}
        >
            {/* Image fills; zero transition for lists */}
            <ThemedImage
                uri={uri}
                title={title}
                contentFit="cover"
                transitionMs={0}
                cachePolicy="memory-disk"
                recyclingKey={uri}
                w="100%"
                h="100%"
                borderRadiusPx={8}       // faster than overflow clipping on Android
            />

            {/* Badge or custom children */}
            {children}

            {/* Title overlay */}
            {showGradient && (
                <>
                    <ThemedLinearGradient
                        style={StyleSheet.absoluteFillObject}
                        start={[0, 0.2]}
                        end={[0, 0.9]}
                        opacity={0.8}
                    />
                    <ThemedText
                        pos="absolute"
                        b="$2.5"
                        l="$2.5"
                        r="$2.5"
                        ta="center"
                        bold
                        col="$color"
                        numberOfLines={titleLines}
                        ellipse
                    >
                        {title}
                    </ThemedText>
                </>
            )}
        </ThemedSurface>
    );

    if (!onPress) return content;

    // Light press feedback with minimal overhead
    return (
        <Pressable onPress={onPress} android_ripple={{ color: 'rgba(0,0,0,0.06)' }}>
            {content}
        </Pressable>
    );
});
