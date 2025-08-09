import { SizableText, styled } from 'tamagui';

export const ThemedText = styled(SizableText, {
    name: 'ThemedText',
    color: '$color',
    fontWeight: 'normal',

    variants: {
        variant: {
            default: {},
            subtle: {
                color: '$colorSubtle',
            },
            focused: {
                fontWeight: 'bold',
            },
        },
    } as const
});
