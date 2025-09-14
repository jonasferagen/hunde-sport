// LoadingOverlay.tsx
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { StackProps } from "tamagui";

import { ThemedYStack } from "@/components/ui/themed";
import { ThemedSpinner } from "@/components/ui/themed/ThemedSpinner";
import { useNavigationProgress } from "@/stores/ui/navigationProgressStore"; // { active, start, stop }
export const LoadingOverlay = React.memo(function LoadingOverlay({
  ...props
}: StackProps) {
  // always-mounted, controlled only by shared value
  const opacity = useSharedValue(0);
  const [pe, setPE] = useState<"none" | "auto">("none"); // gate touches (React state is fine)
  const lastActive = useRef<boolean>(useNavigationProgress.getState().active);
  useEffect(() => {
    // subscribe to store; manage dedupe locally to avoid re-animating on same value
    const unsub = useNavigationProgress.subscribe((state) => {
      const active = state.active;
      if (active === lastActive.current) return;
      lastActive.current = active;
      if (active) {
        setPE("auto"); // block touches immediately
        opacity.value = withTiming(1, { duration: 500 });
      } else {
        opacity.value = withTiming(0, { duration: 500 }, (finished) => {
          if (finished) runOnJS(setPE)("none"); // let touches pass when fully hidden
        });
      }
    });
    return unsub;
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      pointerEvents={pe}
      style={[
        StyleSheet.absoluteFillObject,
        { zIndex: 1000, justifyContent: "center", alignItems: "center" },
        animStyle,
      ]}
    >
      {/* your content */}
      <ThemedYStack
        ai="center"
        jc="center"
        w="100%"
        h="100%"
        {...props}
        theme="tertiary_shade"
      >
        <ThemedSpinner size="large" color="$background" o={0.8} />
      </ThemedYStack>
    </Animated.View>
  );
});
