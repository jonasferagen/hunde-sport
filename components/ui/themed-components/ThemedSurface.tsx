// ThemedSurface.ts
import React from 'react'
import { styled,View } from 'tamagui'

const PRESS_STYLE = {
    opacity: 0.7,
} as const

// ✅ rename to avoid any name collision with a type
export const SurfaceBase = styled(View, {
    name: 'ThemedSurface',
    w: '100%',
    h: '100%',
    ov: 'hidden',
    br: '$3',
    boc: '$borderColor',
    bg: '$background',
    shadowColor: '$shadowColor',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
})

// ✅ always derive from `typeof <component>`
type BaseProps = React.ComponentProps<typeof SurfaceBase>
type BaseRef = React.ComponentRef<typeof SurfaceBase>

// 🔒 Non-interactive may NOT have onPress
type NonInteractiveProps = BaseProps & {
    interactive?: false
    onPress?: never
}

// 🔒 Interactive may have onPress
type InteractiveProps = BaseProps & {
    interactive: true
    onPress?: BaseProps['onPress']
}

export type ThemedSurfaceProps = NonInteractiveProps | InteractiveProps

export const ThemedSurface = React.forwardRef<BaseRef, ThemedSurfaceProps>(
    ({ interactive, onPress, ...rest }, ref) => {
        return (
            <SurfaceBase
                ref={ref}
                pressStyle={interactive ? PRESS_STYLE : undefined}
                animation={interactive ? 'fast' : undefined}
                onPress={interactive ? onPress : undefined}
                {...rest}
            />
        )
    }
)
