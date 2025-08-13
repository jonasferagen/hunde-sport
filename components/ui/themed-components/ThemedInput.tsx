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
    bw: 1,

    placeholderTextColor: '$color',

    hoverStyle: { bg: '$backgroundHover' },
    focusStyle: { boc: '$color', bw: 2, bg: '$backgroundFocus', outlineWidth: 0 },


})
