import { SizableText, styled } from 'tamagui';

export const ThemedText = styled(SizableText, {
    name: 'ThemedText',
    color: '$color',
    fontWeight: 'normal',
    fontSize: '$3',
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
            focused: {
                fontWeight: 'bold',
            },
        },
    } as const
});
