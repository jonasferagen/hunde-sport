import { ChevronDown, ChevronRight } from "@tamagui/lucide-icons";
import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { getTokenValue } from "tamagui";

import { ThemedButton, ThemedText, ThemedXStack } from "@/components/ui";

type LinkRowProps = {
  label: string;
  onPress?: () => void;

  // Tree / expand support
  expandable?: boolean;
  expanded?: boolean;
  onToggle?: () => void;

  // Visuals
  showRightChevron?: boolean; // default true
  indentLevel?: number; // default 0
  disabled?: boolean;
};

export function LinkRow({
  label,
  onPress,
  expandable = false,
  expanded = false,
  onToggle,
  showRightChevron = true,
  indentLevel = 0,
  disabled,
}: LinkRowProps) {
  const LEFT_SLOT_W = 40; // keeps caret column aligned
  const INDENT = getTokenValue("$6", "space"); // same as your tree

  const rot = useSharedValue(expanded ? 180 : 0);
  React.useEffect(() => {
    rot.value = withTiming(expanded ? 180 : 0, { duration: 150 });
  }, [expanded]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rot.value}deg` }],
  }));

  return (
    <ThemedXStack w="100%" ai="center" gap="$2">
      {/* Left expand/collapse slot (fixed width) */}
      <ThemedXStack w={LEFT_SLOT_W} ai="center" jc="center">
        {expandable ? (
          <ThemedButton
            circular
            theme="shade"
            size="$3"
            onPress={onToggle}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <Animated.View style={animatedStyle}>
              <ChevronDown />
            </Animated.View>
          </ThemedButton>
        ) : (
          <View style={{ width: LEFT_SLOT_W, height: 0 }} />
        )}
      </ThemedXStack>

      {/* Main link-like pill (fills) */}
      <ThemedButton
        f={1}
        theme="shade"
        size="$5"
        disabled={disabled}
        onPress={onPress}
        // indent after the caret column to keep hierarchy visual
        pl={indentLevel > 0 ? indentLevel * INDENT : undefined}
        justifyContent="space-between"
      >
        <ThemedText
          f={1}
          numberOfLines={1}
          ellipsizeMode="tail"
          letterSpacing={0.5}
        >
          {label}
        </ThemedText>
        {showRightChevron && <ChevronRight />}
      </ThemedButton>
    </ThemedXStack>
  );
}
