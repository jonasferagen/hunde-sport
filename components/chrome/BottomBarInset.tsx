// components/chrome/shared/BottomBarInset.tsx
import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { BOTTOM_BAR_HEIGHT } from "@/config/app";
import { useDrawerStore } from "@/stores/ui/drawerStore";

type BottomBarInsetProps = {
  insetHeight?: number; // e.g., for tablets or experiments
  durationMs?: number; // keep it tweakable but simple
};

export const BottomBarInset = ({ insetHeight = Number(BOTTOM_BAR_HEIGHT), durationMs = 160 }: BottomBarInsetProps) => {
  //includes opening/closing states
  const isDrawerOpen = useDrawerStore((s) => s.status !== "closed");

  // Start with space reserved by default.
  const insetHeightSharedValue = useSharedValue<number>(insetHeight);

  useEffect(() => {
    const targetHeight = isDrawerOpen ? 0 : insetHeight;
    insetHeightSharedValue.value = withTiming(targetHeight, { duration: durationMs });
  }, [isDrawerOpen, insetHeight, durationMs, insetHeightSharedValue]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: insetHeightSharedValue.value,
  }));

  // pointerEvents="none" so it never intercepts touches.
  return <Animated.View pointerEvents="none" style={animatedStyle} />;
};
