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
                fontWeight: 'normal',
            },
            focused: {
                color: '$colorSubtle',
                fontWeight: 'bold',
            },
        },
    } as const
});
