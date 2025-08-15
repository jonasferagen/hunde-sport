import React, { JSX } from 'react';
import { StackProps, XStack, YStack } from 'tamagui';

interface GridTilesProps<T = any> extends StackProps {
    children?: React.ReactNode;
    data?: T[];
    renderItem?: (args: { item: T; index: number }) => React.ReactNode;
    numColumns?: number;
}

export const GridTiles = <T,>({
    children,
    data,
    renderItem,
    numColumns = 3,
    gap = '$2',
    ...stackProps
}: GridTilesProps<T>): JSX.Element => {
    const items: React.ReactNode[] =
        data && renderItem
            ? data.map((item, index) => renderItem({ item, index }))
            : React.Children.toArray(children);

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
        <YStack f={1} width="100%" gap="$3" {...stackProps}>
            {rows.map((row, rowIndex) => (
                <XStack key={rowIndex} f={1} jc="flex-start" boc="red" bw={1}>
                    {row.map((item, itemIndex) => (
                        <React.Fragment key={itemIndex}>{item}</React.Fragment>
                    ))}
                </XStack>
            ))}
        </YStack>
    );
};
