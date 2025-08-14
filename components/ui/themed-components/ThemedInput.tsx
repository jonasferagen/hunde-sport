import { Input, styled } from 'tamagui'

export const ThemedInput = styled(Input, {
    name: 'ThemedInput',
    size: '$4',
    f: 1,
    px: '$3',
    py: '$2',
    br: '$4',
    bg: '$background',
    color: '$color',
    boc: '$borderColor',
    bw: 2,
    placeholderTextColor: '$color',

    hoverStyle: { boc: '$colorHover', bg: '$backgroundHover' },
    focusStyle: { boc: '$colorFocus', bg: '$backgroundFocus', outlineWidth: 2 },

})
