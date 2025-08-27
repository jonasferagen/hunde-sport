// PageView.tsx
// Memoized backdrop so PageView re-renders don't recompute gradient math
import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { YStackProps } from 'tamagui';

import { BOTTOM_BAR_HEIGHT } from '@/config/app';

import { BottomInsetSpacer, CustomBottomBar } from '../menu/CustomBottomBar';
import { ThemedYStack } from '../ui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

const PageBackdrop = React.memo(function PageBackdrop({
  token = 'background',
}: { token?: string }) {
  return <ThemedLinearGradient token={token} />;
});

type PageViewProps = YStackProps & {
  withGradient?: boolean;
  gradientToken?: string;
};

export const PageView = React.memo(function PageView({
  children,
  withGradient = false,
  gradientToken = 'background',
  ...stackProps
}: PageViewProps) {

  const isFocused = useIsFocused();

  return (
    <ThemedYStack
      f={1}
      gap="none"
      style={{ opacity: isFocused ? 1 : 0 }}
      {...stackProps}
    >
      {withGradient ? <PageBackdrop token={gradientToken} /> : null}
      {children}
      <BottomInsetSpacer />
    </ThemedYStack>
  );
});

// 