import type { ReactNode } from "react";
import type { SpaceTokens, StackProps } from "tamagui";

import { ThemedXStack, ThemedYStack } from "@/components/ui/themed";
import { spacePx } from "@/lib/theme";

export type GridTilesProps<T> = StackProps & {
  items: readonly T[];
  columns: number;
  gapToken?: SpaceTokens; // spacing between tiles (defaults to $3)
  square?: boolean; // force 1:1 aspect ratio per cell
  keyExtractor?: (item: T, index: number) => string;
  renderItem: (args: { item: T; index: number }) => ReactNode;
};

export function GridTiles<T>({
  items,
  columns,
  gapToken = "$3",
  square = false,
  keyExtractor,
  renderItem,
  ...stackProps
}: GridTilesProps<T>) {
  const gapPx = spacePx(gapToken as string);
  const half = Math.round(gapPx / 2);
  const colPct = `${100 / columns}%`;

  if (!items?.length) return null;

  return (
    <ThemedYStack {...stackProps} mx={gapPx}>
      <ThemedXStack fw="wrap" m={-half} gap="$0">
        {items.map((item, index) => {
          const key = keyExtractor?.(item, index) ?? String(index);
          return (
            <ThemedYStack key={key} w={colPct} p={half}>
              <ThemedYStack w="100%" {...(square ? { aspectRatio: 1 } : null)}>
                {renderItem({ item, index })}
              </ThemedYStack>
            </ThemedYStack>
          );
        })}
      </ThemedXStack>
    </ThemedYStack>
  );
}
