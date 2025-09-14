import React from "react";
import { View as RNView } from "react-native";

export const HSpacer: React.FC<{ width: number }> = React.memo(({ width }) => (
  <RNView style={{ width }} />
));
HSpacer.displayName = "HSpacer";

export const VSpacer: React.FC<{ height: number }> = React.memo(
  ({ height }) => <RNView style={{ height }} />,
);
VSpacer.displayName = "VSpacer";
