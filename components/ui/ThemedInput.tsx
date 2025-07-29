import { Input, styled } from 'tamagui'

export const ThemedInput = styled(Input, {
    name: 'ThemedInput',

    // Base style
    color: '$color',
    backgroundColor: '$background',
    borderColor: '$borderColor',
    borderWidth: 1,
    borderRadius: '$3',
    paddingHorizontal: '$3',
    paddingVertical: '$2',

    // Interactions
    hoverStyle: {
        borderColor: '$borderColorHover',
    },

    focusStyle: {
        borderColor: '$blue10',
        outlineWidth: 2,
        outlineColor: '$blue10',
        outlineStyle: 'solid',
    },

    // Variants
    variants: {
        error: {
            true: {
                borderColor: '$red10',
            },
        },
    },

    // Disabled
    disabledStyle: {
        opacity: 0.5,
        backgroundColor: '$background',
    },
})
