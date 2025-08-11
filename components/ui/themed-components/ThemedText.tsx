import { SizableText, styled } from 'tamagui';

export const ThemedText = styled(SizableText, {
    name: 'ThemedText',
    color: '$color',
    fontWeight: 'bold',
    fontSize: '$4',
    disabledStyle: {
        opacity: 0.5,
        textDecorationLine: "line-through"
    },

    variants: {
        variant: {
            default: {},
            subtle: {
                color: '$colorSubtle',
            },
            emphasized: {
                fontWeight: 'bold',
            },
        },
    } as const
});
