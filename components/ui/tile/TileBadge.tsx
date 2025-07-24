import React from "react";
import { View } from "tamagui";

interface TileBadgeProps {
    children: React.ReactNode;
}

export const TileBadge = ({ children }: TileBadgeProps): React.JSX.Element => {
    return (
        <View
            position="absolute"
            top="$2"
            right="$2"
            backgroundColor="$background0.5"
            paddingVertical="$2"
            paddingHorizontal="$3"
            borderRadius="$3"
        >
            {children}
        </View>
    );
};
