import { Button, styled } from 'tamagui'

export const ThemedButton = styled(Button, {
    name: 'ThemedButton',
    elevation: 1,
    // Base style
    color: '$colorAccent',
    backgroundColor: '$colorPrimary',
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
                backgroundColor: '$colorAccentElevated',
                borderColor: '$colorAccentStrong',
                color: '$colorAccentStrong',

                pressStyle: {
                    backgroundColor: '$colorAccent',
                    borderColor: '$colorAccentHover',
                    color: '$colorAccentStrong'
                },
            },
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
        opacity: .4,
        pointerEvents: 'none',
    },
})
