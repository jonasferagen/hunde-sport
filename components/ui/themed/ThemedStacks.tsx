// ThemedStacks.tsx

import { rgba } from "polished";
import type { ComponentProps, ComponentRef, ReactNode } from "react";
import React from "react";
import type { SizeTokens, StackProps, XStackProps, YStackProps } from "tamagui";
import { getVariableValue, Stack, styled, XStack, YStack } from "tamagui";

const DEFAULT_SIZE = "$3";

const config = {
  name: "ThemedStack",
  gap: DEFAULT_SIZE,
  boc: "$borderColor",
  bg: "transparent",
  pos: "relative",
  p: 0,

  variants: {
    container: {
      true: { p: DEFAULT_SIZE, gap: DEFAULT_SIZE },
      "...size": (size: SizeTokens) => ({ p: size, gap: size }),
    },
    split: { true: { ai: "center", jc: "space-between" } },
    pressable: { true: { pressStyle: { opacity: 0.7 } } },
    box: { true: { bw: 0, boc: "$borderColor", bg: "$background" } },
    rounded: { true: { br: "$3" } },
    bgOpacity: (alpha: number, { theme }: { theme: any }) => {
      const tokenValue = theme["background"];
      const base = String(getVariableValue(tokenValue));
      const a = Math.max(0, Math.min(1, Number(alpha) || 0));
      return { bg: rgba(base, a) };
    },
  },
} as const;

// Keep bases internal
const ThemedStackBase = styled(Stack, config);
const ThemedYStackBase = styled(YStack, config);
const ThemedXStackBase = styled(XStack, config);

type Props = { bgOpacity?: number };
type WithChildren<P> = Omit<P, "children"> & { children?: ReactNode };

// If you ever need it internally:
type ThemedStackProps = WithChildren<
  ComponentProps<typeof ThemedStackBase> & StackProps & Props
>;
export const _ThemedStack = React.forwardRef<
  ComponentRef<typeof ThemedStackBase>,
  ThemedStackProps
>(function _ThemedStack(props, ref) {
  return <ThemedStackBase ref={ref} {...props} />;
});

// Public components
export type ThemedYStackProps = WithChildren<
  ComponentProps<typeof ThemedYStackBase> & YStackProps & Props
>;
export const ThemedYStack = React.forwardRef<
  ComponentRef<typeof ThemedYStackBase>,
  ThemedYStackProps
>(function ThemedYStack(props, ref) {
  const { onPress, pressable, ...rest } = props as any;
  return (
    <ThemedYStackBase
      ref={ref}
      {...rest}
      onPress={onPress}
      // auto-enable pressable if onPress is provided, unless explicitly overridden
      pressable={pressable ?? !!onPress}
    />
  );
});

export type ThemedXStackProps = WithChildren<
  ComponentProps<typeof ThemedXStackBase> & XStackProps & Props
>;
export const ThemedXStack = React.forwardRef<
  ComponentRef<typeof ThemedXStackBase>,
  ThemedXStackProps
>(function ThemedXStack(props, ref) {
  const { onPress, pressable, ...rest } = props as any;
  return (
    <ThemedXStackBase
      ref={ref}
      {...rest}
      onPress={onPress}
      pressable={pressable ?? !!onPress}
    />
  );
});
