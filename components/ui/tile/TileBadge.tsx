// components/ui/TileBadge.tsx
import { ThemedXStack } from '@/components/ui';
import React from 'react';
import { StackProps, ThemeName } from 'tamagui';

type Corner = 'tl' | 'tr' | 'bl' | 'br';

interface TileBadgeProps extends StackProps {
    corner?: Corner;        // which corner to pin the badge to
    offset?: number | string; // spacing from edges, defaults to $2
    theme?: ThemeName;         // theme name for the pill
    children: React.ReactNode;
}

export const TileBadge = ({
    corner = 'tr',
    offset = '$2',
    theme,
    children,
    ...props
}: TileBadgeProps) => {
    const pos: Record<Corner, Partial<StackProps>> = {
        tl: { t: offset, l: offset },
        tr: { t: offset, r: offset },
        bl: { b: offset, l: offset },
        br: { b: offset, r: offset },
    };

    return (
        <ThemedXStack
            theme={theme}
            pos="absolute"
            {...pos[corner]}
            ai="center"
            jc="center"
            p="$1"
            px="$2"
            gap="$2"
            br="$3"
            bg="$background"
            ov="hidden"
            elevation="$2"
            pointerEvents="none" // badges are decorative by default
            {...props}
        >
            {children}
        </ThemedXStack>
    );
};
