import React, { JSX } from 'react';
import { StackProps, XStack, YStack } from 'tamagui';

interface GridTilesProps extends StackProps {
    children: React.ReactNode;
    numColumns?: number;
}

export const GridTiles = ({
    children,
    numColumns = 3,
    gap = '$2',
    ...stackProps
}: GridTilesProps): JSX.Element => {
    const items = React.Children.toArray(children);

    if (!items || items.length === 0) {
        return <></>;
    }

    // Chunk items into rows
    const rows = items.reduce((acc: React.ReactNode[][], item, index) => {
        const rowIndex = Math.floor(index / numColumns);
        if (!acc[rowIndex]) {
            acc[rowIndex] = [];
        }
        acc[rowIndex].push(item);
        return acc;
    }, [] as React.ReactNode[][]);

    return (
        <YStack gap={gap} flex={1} {...stackProps}>
            {rows.map((row, rowIndex) => (
                <XStack key={rowIndex} gap={gap} flex={1}>
                    {row.map((item, itemIndex) => (
                        <React.Fragment key={itemIndex}>
                            {item}
                        </React.Fragment>
                    ))}
                </XStack>
            ))}
        </YStack>
    );
};
