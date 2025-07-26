import React, { ReactNode } from 'react';
import { StackProps, YStack } from 'tamagui';

interface ListItemProps extends StackProps {
    header: ReactNode;
    actions: ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({ header, actions, ...props }) => {
    return (
        <YStack gap="$2" {...props}>
            {header}
            {actions}
        </YStack>
    );
};
