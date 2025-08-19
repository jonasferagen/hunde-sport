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
            variant: {
                subtle: { color: '$colorTransparent' },
                default: {} // optional no-op
            },
            bold: { true: { fontWeight: 'bold' } },
        } as const,
    }
);
