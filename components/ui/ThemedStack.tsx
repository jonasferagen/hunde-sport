import { JSX } from 'react';
import { StackProps, XStack, YStack } from 'tamagui';

export interface ThemedStackProps extends StackProps {
    debugColor?: string;
}

const createThemedStack = (
    StackComponent: typeof XStack | typeof YStack
) => {
    const ThemedStack = ({ ...props }: ThemedStackProps): JSX.Element => {
        const { debugColor, ...stackProps } = props;
        const debugProps = debugColor ? { bw: 1, boc: debugColor } : {};

        return <StackComponent p="none" gap="$3" {...stackProps} {...debugProps} />;
    };

    return ThemedStack;
};

export const ThemedYStack = createThemedStack(YStack);
export const ThemedXStack = createThemedStack(XStack);