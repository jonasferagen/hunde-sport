// button.ts
import {
    createStyledContext,
    SizeTokens,
    styled,
    Text,
    useTheme,
    View,
    withStaticProperties,
} from '@tamagui/web'
import { memo } from 'react'
import { ThemedSurface } from './ThemedSurface'

// ----------------------------
// 1) Sizing context + table
// ----------------------------
const DEFAULT_SIZE: SizeTokens = '$4'
export const ButtonContext = createStyledContext({ size: DEFAULT_SIZE })

type SizeKey = '$2' | '$3' | '$4' | '$5' | '$6'
const SIZES: Record<SizeKey, {
    h: number; px: number; gap: number; fs: number; lh: number; icon: number
}> = {
    '$2': { h: 32, px: 10, gap: 8, fs: 13, lh: 18, icon: 16 },
    '$3': { h: 40, px: 14, gap: 10, fs: 15, lh: 20, icon: 18 },
    '$4': { h: 48, px: 16, gap: 12, fs: 16, lh: 22, icon: 20 },
    '$5': { h: 56, px: 18, gap: 12, fs: 18, lh: 24, icon: 22 },
    '$6': { h: 64, px: 20, gap: 14, fs: 20, lh: 26, icon: 24 },
}

// stable style objects (no new identity each render)
const DISABLED_STYLE = { opacity: 0.5 } as const
const HOVER_STYLE = { backgroundColor: '$backgroundHover', borderColor: '$borderColor', opacity: 0.7 } as const
const PRESS_STYLE = { backgroundColor: '$backgroundPress', borderColor: '$borderColor' } as const
const FOCUS_STYLE = { backgroundColor: '$backgroundFocus', borderColor: '$borderColor', outlineWidth: 2, outlineStyle: 'solid' } as const

// ----------------------------
// 2) Frame: inert by default
// ----------------------------
export const ButtonFrame = styled(ThemedSurface, {
    name: 'ThemedButton',
    context: ButtonContext,
    ai: 'center',
    fd: 'row',
    gap: '$2',
    // Don't animate globally; opt-in only when interactive
    // animation: 'fast',
    disabledStyle: DISABLED_STYLE,

    variants: {
        // A) interactivity behind a switch
        interactive: {
            false: {
                hoverStyle: undefined,
                pressStyle: undefined,
                focusStyle: undefined,
                animation: undefined,
                // optional: fully inert for off-screen cells
                // pointerEvents: 'none',
            },
            true: {
                hoverStyle: HOVER_STYLE,
                pressStyle: PRESS_STYLE,
                focusStyle: FOCUS_STYLE,
                animation: 'fast',
            },
        },

        // B) size from token table
        size: {
            '...size': (token: SizeTokens) => {
                const s = SIZES[(token as SizeKey)] ?? SIZES[DEFAULT_SIZE as SizeKey]
                return { height: s.h, paddingHorizontal: s.px, gap: s.gap }
            },
        },

        // C) circular depends on current props.size (no hooks here)
        circular: {
            true: (_val, { props }: { props: { size?: SizeTokens } }) => {
                const s = SIZES[(props.size as SizeKey) ?? (DEFAULT_SIZE as SizeKey)]
                return {
                    bw: 0, br: 9999, w: s.h, h: s.h, px: 0,
                    ai: 'center', jc: 'center', gap: 0,
                }
            },
            false: {},
        },
    } as const,

    defaultVariants: {
        interactive: true,         // safe default
        size: DEFAULT_SIZE,
    },
})

// ----------------------------
// 3) Slots: text + icon
// ----------------------------
export const ButtonText = styled(Text, {
    name: 'ButtonText',
    context: ButtonContext,
    color: '$color',
    userSelect: 'none',
    variants: {
        size: {
            '...size': (token: SizeTokens) => {
                const s = SIZES[(token as SizeKey)] ?? SIZES[DEFAULT_SIZE as SizeKey]
                return { fontSize: s.fs, lineHeight: s.lh }
            },
        },
    } as const,
    defaultVariants: { size: DEFAULT_SIZE },
})

// Prefer a component prop over cloneElement to avoid new children each render
type IconComp = React.ComponentType<{ size?: number; color?: string }>
const ButtonIconBase = memo(({ as: Icon }: { as: IconComp }) => {
    const theme = useTheme()
    const size = ButtonContext.useStyledContext().size as SizeKey
    const s = SIZES[size] ?? SIZES[DEFAULT_SIZE as SizeKey]
    return Icon ? <Icon size={s.icon} color={theme.color?.val} /> : null
})

const ButtonAfter = ({ children }: { children: any }) => <View ml="auto">{children}</View>

// ----------------------------
// 4) Public API
// ----------------------------
export const ThemedButton = withStaticProperties(ButtonFrame, {
    Props: ButtonContext.Provider,
    Text: ButtonText,
    Icon: ButtonIconBase,
    After: ButtonAfter,
})
