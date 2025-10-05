import React from "react";
import { Heading, styled } from "tamagui";

const ThemedHeadingBase = styled(Heading, {
  name: "SectionHeading",

  role: "heading",
  size: "$6",
  variants: {
    tabular: {
      true: {
        numberOfLines: 1,
        fontVariant: ["tabular-nums"],
        flexShrink: 1,
      },
    },
  },
});

/* @TODO: This should not be necessary
 * Shares common functionality with ThemedText, look into merging this
 */
type ThemedHeadingProps = React.ComponentProps<
  typeof ThemedHeadingBase
> & {
  tabular?: boolean;
};
type ThemedHeadingRef = React.ComponentRef<typeof ThemedHeadingBase>;

export const ThemedHeading = React.forwardRef<
  ThemedHeadingRef,
  ThemedHeadingProps
>(function ThemedHeading(props, ref) {
  return <ThemedHeadingBase ref={ref} {...props} />;
});
