// ThemedStacks.tsx

import type { ComponentProps, ComponentRef, ReactNode } from "react";
import React from "react";
import {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import type { SizeTokens, XStackProps, YStackProps } from "tamagui";
import { styled, XStack, YStack } from "tamagui";

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
    fade: {
      true: {
        entering: FadeIn.duration(140),
        exiting: FadeOut.duration(140),
      } as any,
    },
    spring: {
      true: {
        layout: LinearTransition.duration(200).easing(Easing.ease),
      } as any,
    },
  },
} as const;

const ThemedYStackBase = styled(YStack, config);
const ThemedXStackBase = styled(XStack, config);

type Props = { fade?: boolean; spring?: boolean };
type WithChildren<P> = Omit<P, "children"> & { children?: ReactNode };

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
