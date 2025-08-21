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
                default: {},

                price: {
                    // keep on one line and shrink instead of ellipsis
                    numberOfLines: 1,
                    ellipsizeMode: 'clip',
                    adjustsFontSizeToFit: true,
                    minimumFontScale: 0.7,          // tweakable via priceScale below
                    textWrap: 'nowrap',
                    fontVariant: ['tabular-nums'],
                    flexShrink: 1,                   // allow squeeze in flex rows
                },
            },
            bold: { true: { fontWeight: 'bold' } },
        } as const,
    }
);
