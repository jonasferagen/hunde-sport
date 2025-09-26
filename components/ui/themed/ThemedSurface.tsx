// ThemedSurface.ts
import React from "react";
import { styled, View } from "tamagui";

const PRESS_STYLE = {
  opacity: 0.7,
} as const;

const SurfaceBase = styled(View, {
  name: "ThemedSurface",
  w: "100%",
  h: "100%",
  ov: "hidden",
  br: "$3",
  boc: "$borderColor",
  bg: "$background",
  shadowColor: "$shadowColor",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
});

type BaseProps = React.ComponentProps<typeof SurfaceBase>;
type BaseRef = React.ComponentRef<typeof SurfaceBase>;

type NonInteractiveProps = BaseProps & {
  interactive?: false;
  onPress?: never;
};

type InteractiveProps = BaseProps & {
  interactive: true;
  onPress?: BaseProps["onPress"];
};

type ThemedSurfaceProps = NonInteractiveProps | InteractiveProps;

export const ThemedSurface = React.forwardRef<BaseRef, ThemedSurfaceProps>(
  function ThemedSurface({ interactive, onPress, ...rest }, ref) {
    return (
      <SurfaceBase
        ref={ref}
        pressStyle={interactive ? PRESS_STYLE : undefined}
        animation={interactive ? "spring" : undefined}
        onPress={interactive ? onPress : undefined}
        {...rest}
      />
    );
  },
);
