// PageSection.tsx
import { spacePx } from '@/lib/helpers';
import React, { useMemo } from 'react';
import { YStackProps } from 'tamagui';
import { ThemedText } from '../ui';
import { ThemedYStack } from '../ui/themed-components/ThemedStacks';

type SpaceToken = '$1' | '$2' | '$3' | '$4' | '$5' | 'none';

type PageSectionProps = YStackProps & {
  title?: string;
  pad?: SpaceToken;               // section’s horizontal gutter
  bleedX?: boolean;               // let content bleed past the gutter (keeps title aligned)
  fill?: boolean;                 // let children (e.g. FlashList) own height
  useContainer?: boolean;         // NEW: toggle Tamagui "container" behavior
};

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
  pad = '$3',
  bleedX = false,
  fill = false,
  useContainer = true,
  ...stackProps
}) => {
  const padPx = useMemo(() => (pad === 'none' ? 0 : spacePx(pad)), [pad]);
  const hasChildren = React.Children.toArray(children).some(Boolean);
  if (!hasChildren) return null;

  return (
    <ThemedYStack
      box
      {...(useContainer ? { container: true } : {})}  // <- turn off when you want edge-to-edge
      {...stackProps}
    >
      {title ? <ThemedText size="$6" px={useContainer ? padPx : 0}>{title}</ThemedText> : null}

      <ThemedYStack
        px={bleedX || !useContainer ? 0 : padPx}
        mx={bleedX && useContainer ? -padPx : 0}
        f={fill ? 1 : undefined}
        mih={fill ? 0 : undefined}
      >
        {children}
      </ThemedYStack>
    </ThemedYStack>
  );
};
