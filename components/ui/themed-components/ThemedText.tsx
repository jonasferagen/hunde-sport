import { SizableText, styled } from 'tamagui';

export const ThemedText = styled(
    SizableText,
    {
        name: 'ThemedText',
        color: '$color',
        // use font sizing via `size`, not layout `$size` via fontSize
        size: '$4',
        disabledStyle: { opacity: 0.5, textDecorationLine: 'line-through' },

        variants: {
            variant: {
                // v4 uses color, color2, color3... for “subtler” steps
                subtle: { color: '$color2' },
                emphasized: { fontWeight: 700 }, // or a font weight token, e.g. '$7'
            },
        } as const,
    }
);
