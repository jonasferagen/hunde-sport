import { styled, Text } from 'tamagui';

export const ThemedText = styled(Text, {
    name: 'ThemedText',
    color: '$color',
    fontWeight: 'normal',
    letterSpacing: "$0.5",
    variants: {
        variant: {
            default: {},
            subtle: {
                color: '$colorSubtle',
                fontWeight: 'normal',
            },
            focused: {
                color: '$colorSubtle',
                fontWeight: 'bold',
            },
        },
    } as const,
});
