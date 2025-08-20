// PageView.tsx
import { BOTTOM_BAR_HEIGHT } from '@/config/app';
import React from 'react';
import { YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';
// Memoized backdrop so PageView re-renders don't recompute gradient math
import { useIsFocused } from '@react-navigation/native';

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
      mb={BOTTOM_BAR_HEIGHT}
    >
      {withGradient ? <PageBackdrop token={gradientToken} /> : null}
      {children}
    </ThemedYStack>
  );
});

