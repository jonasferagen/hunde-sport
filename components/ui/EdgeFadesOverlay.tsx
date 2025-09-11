// components/lists/EdgeFadesOverlay.tsx
import { rgba } from "polished";
import { useCallback, useEffect, useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getVariableValue, useTheme, XStack, YStack } from "tamagui";

import { ThemedLinearGradient } from "@/components/ui/themed-components";

type Props = {
  orientation: "horizontal" | "vertical";
  widthToken?: any; // for horizontal fades (e.g. '$6')
  heightToken?: any; // for vertical fades (e.g. '$6')
  visibleStart: boolean; // true when scroller is at the start edge (top/left)
  visibleEnd: boolean; // true when scroller is at the end edge (bottom/right)
  /** Base bg (used if bgStart/bgEnd not provided). Accepts hex, rgba(), or a Tamagui token like '$background'. */
  bg?: string;
  /** Optional per-edge background colors (override bg). Accept hex/rgba or Tamagui tokens like '$color2'. */
  bgStart?: string;
  bgEnd?: string;
  durationMs?: number; // fade duration (default 140ms)
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
    [theme]
  );

  const startColor = useMemo(
    () => resolveColor(bgStart ?? bg),
    [bgStart, bg, resolveColor]
  );
  const endColor = useMemo(
    () => resolveColor(bgEnd ?? bg),
    [bgEnd, bg, resolveColor]
  );

  // show scrim when NOT at that edge
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

  const startStyle = useAnimatedStyle(() => ({ opacity: startOp.value }));
  const endStyle = useAnimatedStyle(() => ({ opacity: endOp.value }));

  const startTransparent = rgba(startColor, 0);
  const startSolid = rgba(startColor, 1);
  const endTransparent = rgba(endColor, 0);
  const endSolid = rgba(endColor, 1);

  if (orientation === "horizontal") {
    return (
      <>
        <Animated.View
          style={[
            { position: "absolute", left: 0, top: 0, bottom: 0 },
            startStyle,
          ]}
          pointerEvents="none"
          collapsable={false}
        >
          <XStack w={widthToken} h="100%">
            <ThemedLinearGradient
              colors={[startTransparent, startSolid]}
              start={[1, 0]}
              end={[0, 0]}
            />
          </XStack>
        </Animated.View>

        <Animated.View
          style={[
            { position: "absolute", right: 0, top: 0, bottom: 0 },
            endStyle,
          ]}
          pointerEvents="none"
          collapsable={false}
        >
          <XStack w={widthToken} h="100%">
            <ThemedLinearGradient
              colors={[endSolid, endTransparent]}
              start={[1, 0]}
              end={[0, 0]}
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
        style={[
          { position: "absolute", top: 0, left: 0, right: 0 },
          startStyle,
        ]}
        pointerEvents="none"
        collapsable={false}
      >
        <YStack h={heightToken}>
          <ThemedLinearGradient
            colors={[startTransparent, startSolid]}
            start={[0, 1]}
            end={[0, 0]}
          />
        </YStack>
      </Animated.View>

      <Animated.View
        style={[
          { position: "absolute", bottom: 0, left: 0, right: 0 },
          endStyle,
        ]}
        pointerEvents="none"
        collapsable={false}
      >
        <YStack h={heightToken}>
          <ThemedLinearGradient
            colors={[endSolid, endTransparent]}
            start={[0, 1]}
            end={[0, 0]}
          />
        </YStack>
      </Animated.View>
    </>
  );
}
