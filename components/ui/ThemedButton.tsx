import { Button, styled } from 'tamagui'

export const ThemedButton = styled(Button, {
    name: 'ThemedButton',

    // Base style
    color: '$color',
    backgroundColor: '$background',
    borderColor: '$borderColor',
    borderWidth: '$borderWidth',
    borderRadius: '$3',
    fontWeight: 'bold',

    // Interactions
    hoverStyle: {
        backgroundColor: '$backgroundHover',
        borderColor: '$borderColorStrong',
    },

    pressStyle: {
        backgroundColor: '$backgroundPress',
    },

    focusStyle: {
        backgroundColor: '$backgroundFocus',
        outlineColor: '$shadowColorFocus',
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
    },

    // Disabled
    disabledStyle: {
        opacity: 0.5,
        pointerEvents: 'none',
    },
})
