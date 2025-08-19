// ThemedButton.ts
import React, { cloneElement, isValidElement, memo } from 'react';
import {
    createStyledContext,
    getVariableValue,
    SizeTokens,
    styled,
    Text,
    useTheme,
    View,
    withStaticProperties,
} from 'tamagui'; // ← use the top-level import in RN projects
import { ThemedSurface } from './ThemedSurface';

// ----------------------------
// 1) Sizing context + table
// ----------------------------
const DEFAULT_SIZE: SizeTokens = '$4'
export const ButtonContext = createStyledContext({ size: DEFAULT_SIZE })

type SizeKey = '$2' | '$3' | '$4' | '$5' | '$6'
const SIZES: Record<
    SizeKey,
    { h: number; px: number; gap: number; fs: number; lh: number; icon: number }
> = {
    '$2': { h: 32, px: 10, gap: 8, fs: 13, lh: 18, icon: 16 },
    '$3': { h: 40, px: 14, gap: 10, fs: 15, lh: 20, icon: 18 },
    '$4': { h: 48, px: 16, gap: 12, fs: 16, lh: 22, icon: 20 },
    '$5': { h: 56, px: 18, gap: 12, fs: 18, lh: 24, icon: 22 },
    '$6': { h: 64, px: 20, gap: 14, fs: 20, lh: 26, icon: 24 },
}

// stable style objects
const DISABLED_STYLE = { opacity: 0.5 } as const
const HOVER_STYLE = {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColor',
    opacity: 0.7,
} as const
const PRESS_STYLE = {
    backgroundColor: '$backgroundPress',
    borderColor: '$borderColor',
} as const
const FOCUS_STYLE = {
    backgroundColor: '$backgroundFocus',
    borderColor: '$borderColor',
    outlineWidth: 2,
    outlineStyle: 'solid',
} as const

// ----------------------------
// 2) Frame: inert by default
// ----------------------------
export const ButtonFrame = styled(ThemedSurface, {
    name: 'ThemedButton',
    context: ButtonContext,
    ai: 'center',
    fd: 'row',
    gap: '$2',
    disabledStyle: DISABLED_STYLE,

    variants: {
        interactive: {
            false: {
                hoverStyle: undefined,
                pressStyle: undefined,
                focusStyle: undefined,
                animation: undefined,
            },
            true: {
                hoverStyle: HOVER_STYLE,
                pressStyle: PRESS_STYLE,
                focusStyle: FOCUS_STYLE,
                animation: 'fast',
            },
        },

        size: {
            '...size': (token: SizeTokens) => {
                const s = SIZES[(token as SizeKey) ?? (DEFAULT_SIZE as SizeKey)]
                return { height: s.h, paddingHorizontal: s.px, gap: s.gap }
            },
        },

        circular: {
            true: (_val: boolean, { props }: { props: { size?: SizeTokens } }) => {
                const s = SIZES[(props.size as SizeKey) ?? (DEFAULT_SIZE as SizeKey)]
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
            false: {},
        },
    } as const,

    defaultVariants: {
        interactive: true,
        size: DEFAULT_SIZE,
    },
})

// ----------------------------
// 3) Slots: text + icon + after
// ----------------------------
export const ButtonText = styled(Text, {
    name: 'ButtonText',
    context: ButtonContext,
    color: '$color',
    userSelect: 'none',
    variants: {
        size: {
            '...size': (token: SizeTokens) => {
                const s = SIZES[(token as SizeKey) ?? (DEFAULT_SIZE as SizeKey)]
                return { fontSize: s.fs, lineHeight: s.lh }
            },
        },
    } as const,
    defaultVariants: { size: DEFAULT_SIZE },
})

type IconComp = React.ComponentType<{ size?: number; color?: string }>
type ButtonIconProps = {
    /** Prefer passing a React element as children; `as` is also supported */
    as?: IconComp
    children?: React.ReactNode
    size?: number
    color?: string
}

const ButtonIconBase = memo<ButtonIconProps>(({ as: AsIcon, children, size, color }) => {
    const theme = useTheme()
    const sizeToken = ButtonContext.useStyledContext().size as SizeKey
    const s = SIZES[sizeToken] ?? SIZES[DEFAULT_SIZE as SizeKey]

    const resolvedColor = color ?? String(getVariableValue(theme.color))
    const resolvedSize = size ?? s.icon

    // If a React element is provided, clone it with size/color (don’t override if already set)
    if (children && isValidElement(children)) {
        const el: any = children
        return cloneElement(el, {
            size: el.props?.size ?? resolvedSize,
            color: el.props?.color ?? resolvedColor,
        })
    }

    // If a component type is provided via `as`, render it
    if (AsIcon) {
        return <AsIcon size={resolvedSize} color={resolvedColor} />
    }

    return null
})

const ButtonAfter = ({ children }: { children?: React.ReactNode }) =>
    children ? <View ml="auto">{children}</View> : null

// ----------------------------
// 4) Public API
// ----------------------------
export const ThemedButton = withStaticProperties(ButtonFrame, {
    Props: ButtonContext.Provider,
    Text: ButtonText,
    Icon: ButtonIconBase,
    After: ButtonAfter,
})
