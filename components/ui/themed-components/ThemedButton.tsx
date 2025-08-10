import React from 'react'
import { Button, ButtonProps, styled } from 'tamagui'

const StyledThemedButton = styled(Button, {
    name: 'ThemedButton',

    // Base style
    padding: '$2',
    backgroundColor: '$background',
    borderColor: '$borderColor',
    borderWidth: '$borderWidth',
    borderRadius: '$3',

    // Interactions (these will automatically apply on hover/press/focus)
    hoverStyle: {
        backgroundColor: '$backgroundHover',
        borderColor: '$borderColor',
    },
    pressStyle: {
        backgroundColor: '$backgroundPress',
        borderColor: '$borderColor',
    },
    focusStyle: {
        backgroundColor: '$backgroundFocus',
        borderColor: '$shadowColorFocus',
        outlineWidth: 2,
        outlineStyle: 'solid',
    },

    // Variants
    variants: {
        themedVariant: {
            active: {
                backgroundColor: '$backgroundPress',
                borderColor: '$borderColorStrong',
                color: '$colorStrong',
            },
        },
        circular: {
            true: {
                borderRadius: 9999,
            },
        },
    },


    // Disabled
    disabledStyle: {
        opacity: 0.7,
        pointerEvents: 'none',
    },
})

export const ThemedButton = React.forwardRef<React.ComponentRef<typeof StyledThemedButton>, ButtonProps>(
    (props, ref) => {
        return <StyledThemedButton {...props} ref={ref} />
    }
)
