import { useThemeContext } from '@/contexts';
import React, { ReactNode } from 'react';
import { YStack } from 'tamagui';

interface ListItemProps {
    header: ReactNode;
    actions: ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({ header, actions }) => {
    const { themeManager } = useThemeContext();
    const theme = themeManager.getVariant('default');

    return (
        <YStack borderBottomWidth={1} borderColor={theme.borderColor} gap="$2" padding="$3">
            {header}
            {actions}
        </YStack>
    );
};
