// PageSection.tsx
import { spacePx } from '@/lib/helpers';
import React, { useMemo } from 'react';
import { YStackProps } from 'tamagui';
import { ThemedText } from '../ui';
import { ThemedYStack } from '../ui/themed-components/ThemedStack';

type PageSectionProps = YStackProps & {
  title?: string;
  /** Horizontal padding token for the section container */
  pad?: '$1' | '$2' | '$3' | '$4' | '$5';
  /** Let only the content bleed to screen edges; title remains aligned */
  bleedX?: boolean;
  /** Let children (e.g., FlashList) own the height */
  fill?: boolean;
};

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  children,
  pad = '$3',
  bleedX = false,
  fill = false,
  ...stackProps
}) => {
  const padPx = useMemo(() => spacePx(pad), [pad]);
  const hasChildren = React.Children.toArray(children).some(Boolean);
  if (!hasChildren) return null;

  return (
    <ThemedYStack box container {...stackProps} >
      {title ? (
        <ThemedText size="$6"  >
          {title}
        </ThemedText>
      ) : null}

      {/* Content wrapper: either padded or full-bleed via negative margins */}
      <ThemedYStack
        // normal padded content
        px={bleedX ? undefined : padPx}
        // bleed to edges by canceling the container padding
        mx={bleedX ? -padPx : undefined}

        f={fill ? 1 : undefined}

        mih={fill ? 0 : undefined}
      >
        {children}
      </ThemedYStack>
    </ThemedYStack >
  );
};
