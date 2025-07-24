import { getThemeColors } from "@/styles/Theme";
import { ThemeVariant } from "@/types";
import { rgba } from "@/utils/helpers";
import React from "react";
import { View } from "tamagui";

interface TileBadgeProps {
    children: React.ReactNode;
    themeVariant?: ThemeVariant;
}

export const TileBadge = ({ children, themeVariant = 'default' }: TileBadgeProps): React.JSX.Element => {

    const selectedTheme = getThemeColors(themeVariant);

    return (
        <View
            position="absolute"
            top="$2"
            right="$2"
            backgroundColor={rgba(selectedTheme.bg, 0.7)}
            paddingVertical="$2"
            paddingHorizontal="$3"
            borderRadius="$3"
        >
            {children}
        </View>
    );
};
