import { StoreImage } from '@/domain/StoreImage';
import { getAspectRatio, getScaledImageUrl } from '@/lib/helpers';
import React, { JSX, useCallback, useMemo, useState } from 'react';
import { DimensionValue, LayoutChangeEvent } from 'react-native';
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
    const [measured, setMeasured] = useState<{ w: number; h: number } | null>(null);

    const handleLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        if (width > 0 && height > 0) {
            const w = Math.round(width);
            const h = Math.round(height);
            setMeasured((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h }));
        }
        props.onLayout?.(e);
    }, [props.onLayout]);

    const explicitAspect = typeof props.aspectRatio === 'number' ? props.aspectRatio : undefined;

    const aspectRatio = useMemo(() => {
        return explicitAspect ?? getAspectRatio(props.w as DimensionValue, props.h as DimensionValue);
    }, [explicitAspect, props.w, props.h]);

    const uri = useMemo(() => {
        const targetW = measured?.w ?? (typeof props.w === 'number' ? props.w : undefined);
        let targetH = measured?.h ?? (typeof props.h === 'number' ? props.h : undefined);
        if (!targetH && targetW && explicitAspect) {
            targetH = Math.round(targetW / explicitAspect);
        }
        return getScaledImageUrl(
            image.src,
            (targetW as DimensionValue) ?? (props.w as DimensionValue),
            (targetH as DimensionValue) ?? (props.h as DimensionValue)
        );
    }, [image.src, measured?.w, measured?.h, props.w, props.h, explicitAspect]);


    return (
        <ThemedSurface
            bw={2}
            pressStyle={{ boc: '$borderColorInverse', bg: '$backgroundInverse' }}
            {...props}
            // defaults that fill parent when not provided by caller
            w={(props.w as DimensionValue) ?? '100%'}
            h={(props.h as DimensionValue) ?? (explicitAspect ? undefined : '100%')}
            onLayout={handleLayout}
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
