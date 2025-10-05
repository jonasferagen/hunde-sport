// components/ui/themed/ThemedParagraph.tsx
import React from "react";
import { Platform } from "react-native";
import { Paragraph, styled } from "tamagui";

const ThemedParagraphBase = styled(Paragraph, {
  name: "ThemedParagraph",
  tag: "p",
  color: "$color",
  size: "$3",
  userSelect: "auto",
  whiteSpace: "normal",

  variants: {
    /** Force copyability (useful if an ancestor set userSelect="none") */
    copyable: {
      true: { userSelect: "text" },
    },
    /** Dimmer body text */
    subtle: {
      true: { col: "$colorTransparent" },
    },
    /** Larger intro/lead paragraph */
    lead: {
      true: { fos: "$4", lh: "$2" },
    },
    /** Smaller, tighter body */
    small: {
      true: { fos: "$2", lh: "$1" },
    },
    /** Clamp to N lines (uses RN's numberOfLines) */
    clamp: {
      1: { numberOfLines: 1, ellipsizeMode: "tail" },
      2: { numberOfLines: 2, ellipsizeMode: "tail" },
      3: { numberOfLines: 3, ellipsizeMode: "tail" },
    },
  },
} as const);

type ThemedParagraphProps = React.ComponentProps<typeof ThemedParagraphBase>;
type ThemedParagraphRef = React.ComponentRef<typeof ThemedParagraphBase>;

export const ThemedParagraph = React.forwardRef<ThemedParagraphRef, ThemedParagraphProps>((props, ref) => (
  <ThemedParagraphBase
    ref={ref}
    // Helps on web/iOS if a global reset disabled the long-press callout
    {...(Platform.OS === "web" ? { style: { WebkitTouchCallout: "default" } } : undefined)}
    {...props}
  />
));
ThemedParagraph.displayName = "ThemedParagraph";
