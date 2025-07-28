import { Button, styled } from 'tamagui'

export const ThemedButton = styled(Button, {
    name: 'ThemedButton',

    // Base style
    color: '$color',
    backgroundColor: '$backgroundLight',
    borderColor: '$borderColor',
    borderWidth: '$borderWidth',
    borderRadius: '$3',
    fontWeight: 'bold',

    // Interactions
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

    // Accent variant (optional)
    variants: {
        variant: {
            accent: {
                backgroundColor: '$colorAccent',
                color: '$color',
                hoverStyle: {
                    backgroundColor: '$colorAccentHover',
                },
                pressStyle: {
                    backgroundColor: '$colorAccentPress',
                },
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
        opacity: 0.3,
        pointerEvents: 'none',
    },
})
