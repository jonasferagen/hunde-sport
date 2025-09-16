// components/lists/EdgeFadesOverlay.tsx
import { rgba } from "polished";
import React, { useCallback, useEffect, useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getVariableValue, useTheme, XStack, YStack } from "tamagui";

import { ThemedLinearGradient } from "@/components/ui/themed";

// ---- module-level stable constants (no re-allocations) ----------------------
const ABS_LEFT = { position: "absolute", left: 0, top: 0, bottom: 0 } as const;
const ABS_RIGHT = {
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
} as const;
const ABS_TOP = { position: "absolute", top: 0, left: 0, right: 0 } as const;
const ABS_BOTTOM = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
} as const;

const GRADIENT_H_START = [1, 0] as const; // horizontal: right -> left
const GRADIENT_H_END = [0, 0] as const;
const GRADIENT_V_START = [0, 1] as const; // vertical: bottom -> top
const GRADIENT_V_END = [0, 0] as const;

type Props = {
  orientation: "horizontal" | "vertical";
  /** for horizontal fades (e.g., '$6' or number px) */
  widthToken?: any;
  /** for vertical fades (e.g., '$6' or number px) */
  heightToken?: any;
  /** true when scroller is at the start edge (top/left) */
  visibleStart: boolean;
  /** true when scroller is at the end edge (bottom/right) */
  visibleEnd: boolean;
  /** Base bg (used if bgStart/bgEnd not provided). Token like '$background' or any CSS color. */
  bg?: string;
  /** Optional per-edge background colors (override bg) */
  bgStart?: string;
  bgEnd?: string;
  /** fade duration (default 140ms) */
  durationMs?: number;
};

export function EdgeFadesOverlay({
  orientation,
  widthToken = "$6",
  heightToken = "$6",
  visibleStart,
  visibleEnd,
  bg,
  bgStart,
  bgEnd,
  durationMs = 140,
}: Props) {
  const theme = useTheme();

  // Resolve token or raw color string to a concrete color
  const resolveColor = useCallback(
    (c?: string) => {
      if (!c) return String(getVariableValue(theme.background));
      if (c.startsWith?.("$")) {
        const key = c.slice(1);
        const v = (theme as any)[key];
        if (v != null) return String(getVariableValue(v));
      }
      return c; // assume raw color string
    },
    [theme],
  );

  const startColor = useMemo(
    () => resolveColor(bgStart ?? bg),
    [bgStart, bg, resolveColor],
  );
  const endColor = useMemo(
    () => resolveColor(bgEnd ?? bg),
    [bgEnd, bg, resolveColor],
  );

  // Show scrim when NOT at that edge
  const showStartFade = !visibleStart;
  const showEndFade = !visibleEnd;

  const startOp = useSharedValue(showStartFade ? 1 : 0);
  const endOp = useSharedValue(showEndFade ? 1 : 0);

  useEffect(() => {
    startOp.value = withTiming(showStartFade ? 1 : 0, { duration: durationMs });
  }, [showStartFade, durationMs, startOp]);

  useEffect(() => {
    endOp.value = withTiming(showEndFade ? 1 : 0, { duration: durationMs });
  }, [showEndFade, durationMs, endOp]);

  const startStyleObj = useAnimatedStyle(() => ({ opacity: startOp.value }));
  const endStyleObj = useAnimatedStyle(() => ({ opacity: endOp.value }));

  // memoized style arrays (avoid inline [a, b] in JSX)
  const startStyleH = useMemo(
    () => [ABS_LEFT, startStyleObj] as const,
    [startStyleObj],
  );
  const endStyleH = useMemo(
    () => [ABS_RIGHT, endStyleObj] as const,
    [endStyleObj],
  );
  const startStyleV = useMemo(
    () => [ABS_TOP, startStyleObj] as const,
    [startStyleObj],
  );
  const endStyleV = useMemo(
    () => [ABS_BOTTOM, endStyleObj] as const,
    [endStyleObj],
  );

  // Colors (memoize to avoid new strings/arrays in JSX)
  const startTransparent = useMemo(() => rgba(startColor, 0), [startColor]);
  const startSolid = useMemo(() => rgba(startColor, 1), [startColor]);
  const endTransparent = useMemo(() => rgba(endColor, 0), [endColor]);
  const endSolid = useMemo(() => rgba(endColor, 1), [endColor]);

  const colorsStartH = useMemo(
    () => [startTransparent, startSolid] as const,
    [startTransparent, startSolid],
  );
  const colorsEndH = useMemo(
    () => [endSolid, endTransparent] as const,
    [endSolid, endTransparent],
  );

  const colorsStartV = useMemo(
    () => [startTransparent, startSolid] as const,
    [startTransparent, startSolid],
  );
  const colorsEndV = useMemo(
    () => [endSolid, endTransparent] as const,
    [endSolid, endTransparent],
  );

  if (orientation === "horizontal") {
    return (
      <>
        <Animated.View
          style={startStyleH}
          pointerEvents="none"
          collapsable={false}
        >
          <XStack w={widthToken} h="100%">
            <ThemedLinearGradient
              colors={colorsStartH}
              start={GRADIENT_H_START}
              end={GRADIENT_H_END}
            />
          </XStack>
        </Animated.View>

        <Animated.View
          style={endStyleH}
          pointerEvents="none"
          collapsable={false}
        >
          <XStack w={widthToken} h="100%">
            <ThemedLinearGradient
              colors={colorsEndH}
              start={GRADIENT_H_START}
              end={GRADIENT_H_END}
            />
          </XStack>
        </Animated.View>
      </>
    );
  }

  // vertical
  return (
    <>
      <Animated.View
        style={startStyleV}
        pointerEvents="none"
        collapsable={false}
      >
        <YStack h={heightToken}>
          <ThemedLinearGradient
            colors={colorsStartV}
            start={GRADIENT_V_START}
            end={GRADIENT_V_END}
          />
        </YStack>
      </Animated.View>

      <Animated.View style={endStyleV} pointerEvents="none" collapsable={false}>
        <YStack h={heightToken}>
          <ThemedLinearGradient
            colors={colorsEndV}
            start={GRADIENT_V_START}
            end={GRADIENT_V_END}
          />
        </YStack>
      </Animated.View>
    </>
  );
}
