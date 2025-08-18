import { JSX } from "react";
import { YStack, YStackProps } from "tamagui";

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
