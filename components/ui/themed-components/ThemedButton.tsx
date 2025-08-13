import {
    SizeTokens,
    Text,
    View,
    createStyledContext,
    styled,
    useTheme,
    withStaticProperties
} from '@tamagui/web'
import { cloneElement, isValidElement, useContext } from 'react'

// 1) Context for sizing between parts
// 1) Context — make $3 the default
export const ButtonContext = createStyledContext({
    size: '$3' as SizeTokens,
})

// 2) Shared size table (tweak to taste)
type SizeKey = '$2' | '$3' | '$4' | '$5' | '$6'

const SIZES: Record<SizeKey, {
    h: number        // button height
    px: number       // horizontal padding
    gap: number      // space between icon/text/after
    fs: number       // fontSize
    lh: number       // lineHeight
    icon: number     // icon size (px)
}> = {
    '$2': { h: 32, px: 10, gap: 8, fs: 13, lh: 18, icon: 16 },
    '$3': { h: 40, px: 14, gap: 10, fs: 15, lh: 20, icon: 18 }, // ← standard
    '$4': { h: 48, px: 16, gap: 12, fs: 16, lh: 22, icon: 20 },
    '$5': { h: 56, px: 18, gap: 12, fs: 18, lh: 24, icon: 22 },
    '$6': { h: 64, px: 20, gap: 14, fs: 20, lh: 26, icon: 24 },
}

// 3) Frame uses the table
export const ButtonFrame = styled(View, {
    name: 'ThemedButton',
    context: ButtonContext,
    ai: 'center',
    fd: 'row',
    br: '$3',
    bw: 1,
    animation: 'fast',

    gap: '$2',
    backgroundColor: '$background',
    borderColor: '$borderColor',
    borderWidth: '$borderWidth',

    disabledStyle: { opacity: 0.5 },
    hoverStyle: { backgroundColor: '$backgroundHover', borderColor: '$borderColor' },
    pressStyle: { backgroundColor: '$backgroundPress', borderColor: '$borderColor' },
    focusStyle: {
        backgroundColor: '$backgroundFocus',
        borderColor: '$borderColor',
        outlineWidth: 2,
        outlineStyle: 'solid',
    },

    variants: {
        size: {
            '...size': (token) => {
                const s = SIZES[(token as SizeKey)] ?? SIZES['$3']
                return {
                    height: s.h,
                    paddingHorizontal: s.px,
                    gap: s.gap,
                }
            },
        },

        circular: {
            true: () => {
                const { size } = useContext(ButtonContext.context)
                const s = SIZES[(size as SizeKey)] ?? SIZES['$3']
                return {
                    bw: 0,
                    br: 9999,
                    w: s.h,
                    h: s.h,
                    px: 0,
                    ai: 'center',
                    jc: 'center',
                    gap: 0,
                }
            },
        },
    } as const,

    defaultVariants: {
        size: '$3', // ← default/standard
    },
})

// 4) Text slot uses the same table
export const ButtonText = styled(Text, {
    name: 'ButtonText',
    context: ButtonContext,
    color: '$color',
    userSelect: 'none',

    variants: {
        size: {
            '...size': (token) => {
                const s = SIZES[(token as SizeKey)] ?? SIZES['$3']
                return {
                    fontSize: s.fs,
                    lineHeight: s.lh,
                }
            },
        },
    } as const,

    defaultVariants: { size: '$3' },
})

// 5) Icon slot reads from the table too
const ButtonIcon = (props: { children: any }) => {
    const { size } = useContext(ButtonContext.context)
    const theme = useTheme()
    const s = SIZES[(size as SizeKey)] ?? SIZES['$3']

    return isValidElement(props.children)
        ? cloneElement(props.children, {
            size: s.icon,
            color: theme.color?.val,
        })
        : null
}


// 6) After slot unchanged
const ButtonAfter = (props: { children: any }) => <View ml="auto">{props.children}</View>

// 7) Export stays the same
export const ThemedButton = withStaticProperties(ButtonFrame, {
    Props: ButtonContext.Provider,
    Text: ButtonText,
    Icon: ButtonIcon,
    After: ButtonAfter,
})

