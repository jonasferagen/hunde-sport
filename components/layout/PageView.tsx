// PageView.tsx
import { THEME_PAGE } from '@/config/app';
import React from 'react';
import { YStackProps } from 'tamagui';
import { ThemedYStack } from '../ui';
import { ThemedLinearGradient } from '../ui/themed-components/ThemedLinearGradient';

// Memoized backdrop so PageView re-renders don't recompute gradient math
const PageBackdrop = React.memo(function PageBackdrop({
  token = 'background',
}: { token?: string }) {
  return <ThemedLinearGradient token={token} />;
});

type PageViewProps = YStackProps & {
  withGradient?: boolean;
  gradientToken?: string;
};

export const PageView = ({ children, withGradient = true, gradientToken = 'background', ...stackProps }: PageViewProps) => {
  return (
    <ThemedYStack theme={THEME_PAGE} f={1} gap="none" {...stackProps}>
      {withGradient ? <PageBackdrop token={gradientToken} /> : null}
      {children}
    </ThemedYStack>
  );
};
