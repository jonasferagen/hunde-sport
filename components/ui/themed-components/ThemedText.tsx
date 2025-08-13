import { SizableText, styled } from 'tamagui';

export const ThemedText = styled(
    SizableText,
    {
        color: '$color',
        fontSize: '$4',            // SizableText prefers `size` token over raw fontSize
        fontWeight: 400,       // use numeric weights; 'normal' isn't typed
        disabledStyle: {
            opacity: 0.5,
            textDecorationLine: 'line-through',
        },

        variants: {
            variant: {
                subtle: { color: '$colorSubtle' },
                emphasized: { fontWeight: 700 },
            },
        } as const,
    },
    {
        name: 'ThemedText',     // <-- put `name` in the static config (3rd arg)
    }
);
