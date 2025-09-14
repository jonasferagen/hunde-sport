import React from "react";
import { SizableText, styled } from "tamagui";

const ThemedTextBase = styled(SizableText, {
  name: "ThemedText",
  color: "$color",
  size: "$3",
  disabledStyle: { opacity: 0.5, textDecorationLine: "line-through" },
  variants: {
    bold: { true: { fow: "bold" } },
    subtle: { true: { col: "$colorTransparent" } },
    copyable: {
      true: {
        userSelect: "auto",
        pointerEvents: "auto", // make sure it can receive long-press
      },
    },
    tabular: {
      true: {
        numberOfLines: 1,
        ellipsizeMode: "clip",
        fontVariant: ["tabular-nums"],
        flexShrink: 1,
      },
    },
    adjust: {
      true: {
        numberOfLines: 2,
        ellipsizeMode: "tail",
      },
    },
  },
} as const);

/* Shouldnt be necessary to be explicit about the psops here */

export type ThemedTextProps = React.ComponentProps<typeof ThemedTextBase> & {
  bold?: boolean;
  subtle?: boolean;
  tabular?: boolean;
  copyable?: boolean;
  adjust?: boolean;
};
export type ThemedTextRef = React.ComponentRef<typeof ThemedTextBase>;

export const ThemedText = React.forwardRef<ThemedTextRef, ThemedTextProps>(
  function ThemedText(props, ref) {
    return <ThemedTextBase ref={ref} {...props} />;
  },
);
ThemedText.displayName = "ThemedText";
