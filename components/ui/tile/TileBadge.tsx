import React from "react";
import { YStack, YStackProps } from "tamagui";

interface TileBadgeProps extends YStackProps {
    children: React.ReactNode;

}

export const TileBadge = ({ children, ...props }: TileBadgeProps): React.JSX.Element => {

    return (
        <YStack

            pos="absolute"
            t="$2"
            r="$2"
            bc="$backgroundAlpha"
            bw={1}
            boc="$borderColorStrong"
            px="$1"
            br="$3"
            {...props}
        >
            {children}
        </YStack>
    );
};
