import React from 'react'
import { GetProps, SizableText, SizableTextProps, styled } from 'tamagui'

const ThemedTextBase = styled(SizableText, {
    name: 'ThemedText',
    color: '$color',
    size: '$3',

    disabledStyle: { opacity: 0.5, textDecorationLine: 'line-through' },

    variants: {
        variant: {
            subtle: { color: '$colorTransparent' },
            default: {},
            price: {
                numberOfLines: 1,
                ellipsizeMode: 'clip',
                adjustsFontSizeToFit: true,
                minimumFontScale: 0.7,
                // textWrap is not a React Native prop; consider removing if targeting native
                // textWrap: 'nowrap',
                fontVariant: ['tabular-nums'],
                flexShrink: 1,
            },
        },
        bold: { true: { fontWeight: 'bold' } },
    } as const,
})

export type ThemedTextProps = GetProps<typeof ThemedTextBase> & SizableTextProps

export const ThemedText = ({ ...props }: ThemedTextProps) => (
    <ThemedTextBase {...props} />
)
