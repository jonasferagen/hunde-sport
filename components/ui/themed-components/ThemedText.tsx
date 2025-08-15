import { SizableText, styled } from 'tamagui';

export const ThemedText = styled(
    SizableText,
    {
        name: 'ThemedText',
        color: '$color',
        // use font sizing via `size`, not layout `$size` via fontSize
        size: '$3',
        disabledStyle: { opacity: 0.5, textDecorationLine: 'line-through' },

        variants: {
            subtle: { true: { color: '$colorTransparent' } },
            bold: {
                true: { fontWeight: "$7" },
            },
        } as const,
    }
);
