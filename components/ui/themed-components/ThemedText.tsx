import React, { ComponentRef, } from 'react'
import { SizableText, styled } from 'tamagui'

const ThemedTextBase = styled(SizableText, {
    name: 'ThemedText',
    color: '$color',
    size: '$3',
    disabledStyle: { opacity: 0.5, textDecorationLine: 'line-through' },
    variants: {
        bold: { true: { fow: 'bold' } },
        subtle: { true: { col: '$colorTransparent' } },
        price: {
            true: {
                numberOfLines: 1,
                ellipsizeMode: 'clip',
                adjustsFontSizeToFit: true,
                minimumFontScale: 0.7,
                fontVariant: ['tabular-nums'],
                flexShrink: 1
            }
        }
    }
} as const);

/* Shouldnt be necessary to be explicit about the psops here */

export type ThemedTextProps = React.ComponentProps<typeof ThemedTextBase> & {
    bold?: boolean;
    subtle?: boolean;
    price?: boolean;
};
export type ThemedTextRef = React.ComponentRef<typeof ThemedTextBase>

export const ThemedText = React.forwardRef<
    ThemedTextRef, ThemedTextProps>(
        (props, ref) => <ThemedTextBase ref={ref} {...props} />
    );
