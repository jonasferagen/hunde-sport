import { ThemeVariant } from "@/types";
import { rgba } from "@/utils/helpers";
import React from "react";
import { YStack, useTheme } from "tamagui";

interface TileBadgeProps {
    children: React.ReactNode;
    theme?: ThemeVariant;
}

export const TileBadge = ({ children, theme = 'primary' }: TileBadgeProps): React.JSX.Element => {
    const themeValues = useTheme();

    return (
        <YStack
            theme={theme}
            position="absolute"
            top="$2"
            right="$2"
            backgroundColor={rgba(themeValues.background.val, 0.7)}
            borderWidth={1}
            borderColor={"$borderColor"}
            paddingVertical="$1"
            paddingHorizontal="$2"
            borderRadius="$3"
        >
            {children}
        </YStack>
    );
};
