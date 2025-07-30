import { ThemeVariant } from "@/types";
import React from "react";
import { YStack } from "tamagui";

interface TileBadgeProps {
    children: React.ReactNode;
    theme?: ThemeVariant;
}

export const TileBadge = ({ children, theme = 'primary' }: TileBadgeProps): React.JSX.Element => {

    return (
        <YStack
            theme={theme}
            pos="absolute"
            t="$2"
            r="$2"
            bc="$backgroundAlpha"
            bw={1}
            boc="$borderColorStrong"
            px="$1"
            br="$3"
        >
            {children}
        </YStack>
    );
};
