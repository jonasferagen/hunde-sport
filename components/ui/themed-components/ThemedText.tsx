import React from 'react'
import { SizableText, styled } from 'tamagui'

export const ThemedTextBase = styled(SizableText, {
    name: 'ThemedText',
    color: '$color',
    size: '$3',

    disabledStyle: { opacity: 0.5, textDecorationLine: 'line-through' },

    variants: {
        variant: {
            default: {},
            price: {
                numberOfLines: 1,
                ellipsizeMode: 'clip',
                adjustsFontSizeToFit: true,
                minimumFontScale: 0.7,
                fontVariant: ['tabular-nums'],
                flexShrink: 1,
            },
        },
        bold: { true: { fow: 'bold' } },
        subtle: { true: { col: '$colorTransparent' } },
    } as const,
} as const)

export type ThemedTextProps = React.ComponentProps<typeof ThemedTextBase> & {
    bold?: boolean,
    subtle?: boolean,
    variant?: 'default' | 'price'
}


type ThemedTextRef = React.ComponentRef<typeof SizableText>

export const ThemedText = React.forwardRef<ThemedTextRef, ThemedTextProps>(
    (props, ref) => <ThemedTextBase ref={ref} {...props} />
)