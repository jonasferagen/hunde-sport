import React, { ReactNode } from 'react';
import { YStack } from 'tamagui';

interface ListItemProps {
    header: ReactNode;
    actions: ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({ header, actions }) => {
    return (
        <YStack theme='secondary' gap="$2">
            {header}
            {actions}
        </YStack>
    );
};
