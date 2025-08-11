import { getSize } from '@tamagui/get-token'
import {
    SizeTokens,
    Text,
    View,
    createStyledContext,
    styled,
    useTheme,
    withStaticProperties,
} from '@tamagui/web'
import { cloneElement, isValidElement, useContext } from 'react'

// 1) Context for sizing between parts
export const ButtonContext = createStyledContext({
    size: '$4' as SizeTokens, // default size
})

// 2) Root frame
export const ButtonFrame = styled(View, {
    name: 'ThemedButton',
    context: ButtonContext,
    ai: 'center',
    fd: 'row',
    br: '$3',
    px: '$3',
    gap: '$2',

    backgroundColor: '$background',
    borderColor: '$borderColor',
    borderWidth: '$borderWidth',

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
        borderColor: '$borderColor',
        outlineWidth: 2,
        outlineStyle: 'solid',
    },

    variants: {
        circular: { true: { borderRadius: 9999, px: 0, width: 'auto' } },
        size: {
            '...size': (val) => {
                const sz = getSize(val)
                return {
                    height: sz.val * 2, // slimmer than Tamagui default
                    paddingHorizontal: sz.val * 0.75,
                }
            },
        },
    } as const,

    defaultVariants: {
        size: '$4',
    },
})

// 3) Text slot
export const ButtonText = styled(Text, {
    name: 'ButtonText',
    context: ButtonContext,
    color: '$color',
    userSelect: 'none',


})

// 4) Icon slot
const ButtonIcon = (props: { children: any }) => {
    const { size } = useContext(ButtonContext.context)
    const sz = getSize(size)
    const iconSize = sz.val * 0.75 // matches text nicely
    const theme = useTheme()
    return isValidElement(props.children)
        ? cloneElement(props.children, {
            size: iconSize,
            color: theme.color?.val,
        })
        : null
}

// 5) After slot
const ButtonAfter = (props: { children: any }) => {
    return <View ml="auto">{props.children}</View>
}

// 6) Export
export const ThemedButton = withStaticProperties(ButtonFrame, {
    Props: ButtonContext.Provider,
    Text: ButtonText,
    Icon: ButtonIcon,
    After: ButtonAfter,
})
